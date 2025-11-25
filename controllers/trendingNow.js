import Product from "../models/product.js";
import Trending from "../models/trendingNow.js";

export const incrementViews = async (req, res) => {
  const { productId } = req.params;

  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const trending = await Trending.findOneAndUpdate(
      { product: product._id },
      { $inc: { views: 1 } }, 
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    
    trending.trendingScore = trending.views * 0.5 + trending.addedToCartCount * 1.5;
    await trending.save();

    res.json(trending);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error incrementing views" });
  }
};

export const incrementAddToCart = async (req, res) => {
  const { productId } = req.params;

  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const trending = await Trending.findOneAndUpdate(
      { product: product._id },
      { $inc: { addedToCartCount: 1 } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    trending.trendingScore = trending.views * 0.5 + trending.addedToCartCount * 1.5;
    await trending.save();

    res.json(trending);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error incrementing add-to-cart" });
  }
};


export const getTrendingProducts = async (req, res) => {
  try {
    const trendingRecords = await Trending.find().populate("product");

    const validTrending = trendingRecords.filter(record => record.product);

    const trendingProducts = validTrending
      .map(record => {
        const score =
          (record.views || 0) * 0.5 +
          (record.addedToCartCount || 0) * 1.5;

        return {
          ...record.product._doc, 
          trendingScore: score,
        };
      })
      .sort((a, b) => b.trendingScore - a.trendingScore) 
      .slice(0, 8); 

    return res.json(trendingProducts);
  } catch (error) {
    console.error("Error fetching trending products:", error);
    return res.status(500).json({ message: "Error fetching trending products" });
  }
};
