import Review from "../models/review.js";
import User from "../models/user.js";

export const createReview = async (req, res) => {
    if(req.user===null){
        res.status(403).json({message:'Please login and try again'});
        return;
    }
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

export const getAllReviews = async (req, res) => {
    if(req.user===null){
        res.status(403).json({message:'Please login and try again'});
        return;
    }
    try {
        const userId = req.user?._id;
        if (!userId) {
        return res.status(401).json({ message: "Unauthorized: Please log in" });
        }

        const currentUser = await User.findById(userId);

        if(currentUser.role === "Admin"){
            const reviews = await Review.find().sort({ date: -1 })
                .populate("userId", "firstName lastName email") 
                .populate("productId", "name images description normalPrice labeledPrice");

            res.status(200).json({message: "Reviews fetched successfully",reviews});
        }else{
            const reviews = await Review.find({userId:userId}).sort({ date: -1 })
                .populate("productId", "name images description normalPrice labeledPrice");
            res.status(200).json({message: "Reviews fetched successfully",reviews}); 
        }
    } catch (error) {
        console.log("Get reviews error:", error);
        res.status(500).json({ message: "Failed to fetch reviews", error });
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
    if(req.user===null){
        res.status(403).json({message:'Please login and try again'});
        return;
    }
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
