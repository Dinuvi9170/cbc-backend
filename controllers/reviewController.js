import Review from "../models/review.js";

export const createReview = async (req, res) => {
  try {
    const userId = req.user._id; 
    const { productId, rating, comment } = req.body;

    if (!productId || !rating) {
      return res.status(400).json({ message: "Product and rating required" });
    }

    const review = await Review.create({
      userId: userId,
      productId: productId,
      rating,
      comment,
    });

    res.status(201).json({
      message: "Review created successfully",
      review,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to create review", error });
  }
};

export const getReviewsByProduct = async (req, res) => {
  try {
    const productId = req.params.productId;

    const reviews = await Review.find({ productId: productId })
      .populate("userId", "firstName lastName profileimage")
      .sort({ createdAt: -1 });

    res.status(200).json(reviews);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to fetch reviews", error });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const reviewId = req.params.reviewId;
    const userId = req.user._id;

    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (review.userId.toString() !== userId && req.user.role !== "Admin") {
      return res.status(403).json({ message: "Not authorized to delete this review" });
    }

    await Review.findByIdAndDelete(reviewId);

    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to delete review", error });
  }
};
