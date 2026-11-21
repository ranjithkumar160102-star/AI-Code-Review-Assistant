import express from "express";

import { protect } from "../middleware/auth.middleware.js";

import {
  getReviews,
  getReview,
  removeReview,
  getStats,
} from "../controllers/review.controller.js";

const router = express.Router();

router.get("/", protect, getReviews);
router.get("/stats", protect, getStats);
router.get("/:id", protect, getReview);
router.delete("/:id", protect, removeReview);

export default router;