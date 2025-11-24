import express from "express";
import { createReview, getReviewsByProduct, deleteReview } from "../controllers/reviewController.js";

const Reviewrouter = express.Router();

Reviewrouter.post("/", createReview);
Reviewrouter.get("/:productId", getReviewsByProduct);
Reviewrouter.delete("/:reviewId", deleteReview);

export default Reviewrouter;
