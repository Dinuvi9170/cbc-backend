import express from "express";
import { createReview, getReviewsByProduct, deleteReview, getAllReviews } from "../controllers/reviewController.js";

const Reviewrouter = express.Router();

Reviewrouter.post("/", createReview);
Reviewrouter.get('/',getAllReviews);
Reviewrouter.get("/:productId", getReviewsByProduct);
Reviewrouter.delete("/:reviewId", deleteReview);

export default Reviewrouter;
