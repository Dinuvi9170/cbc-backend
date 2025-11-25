import express from "express";
import { createReview, getReviewsByProduct, deleteReview, getAllReviews } from "../controllers/reviewController.js";
import { verifyToken } from "../controllers/middlewares/Authmiddleware.js";

const Reviewrouter = express.Router();

Reviewrouter.post("/",verifyToken, createReview);
Reviewrouter.get('/',getAllReviews);
Reviewrouter.get("/:productId", getReviewsByProduct);
Reviewrouter.delete("/:reviewId", deleteReview);

export default Reviewrouter;
