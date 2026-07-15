import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
  getReviews,
  getReview,
  removeReview,
  getStats,
} from "../controllers/review.controller.js";

const router = express.Router();

// Get all reviews
router.get("/", protect, getReviews);

// Get dashboard statistics
router.get("/stats", protect, getStats);

// Get single review
router.get("/:id", protect, getReview);

// Delete review
router.delete("/:id", protect, removeReview);

export default router;