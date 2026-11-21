import express from "express";

import {
  register,
  login,
  getProfile,
  updateProfile,
} from "../controllers/auth.controller.js";

import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// Public Routes
router.post("/register", register);
router.post("/login", login);

// Protected Routes
router.get("/me", protect, getProfile);
router.put("/profile", protect, updateProfile);

export default router;