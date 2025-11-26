import express from "express";
import { createReview, getReviewsByProduct, deleteReview, getAllReviews } from "../controllers/reviewController.js";
import { requireAdmin, requireAuth } from "../controllers/middlewares/Authmiddleware.js";

const Reviewrouter = express.Router();

Reviewrouter.post("/", requireAuth, createReview);
Reviewrouter.get('/',requireAuth,getAllReviews);
Reviewrouter.get("/:productId", getReviewsByProduct);
Reviewrouter.delete("/:reviewId",requireAuth, requireAdmin, deleteReview);

export default Reviewrouter;
