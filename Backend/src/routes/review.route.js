import express from "express";
import {
  getReviewsByProduct,
  createReview,
  deleteReview,
} from "../controllers/review.controller.js";

const router = express.Router();

router.get("/reviews/product/:productId", getReviewsByProduct);
router.post("/reviews", createReview);
router.delete("/reviews/:reviewId", deleteReview);

export default router;
