import mongoose from "mongoose";

const TrendingSchema = mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Products", 
      required: true,
      unique: true, 
    },
    views: {
      type: Number,
      default: 0,
    },
    addedToCartCount: {
      type: Number,
      default: 0,
    },
    trendingScore: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Trending = mongoose.model("Trending", TrendingSchema);

export default Trending;
