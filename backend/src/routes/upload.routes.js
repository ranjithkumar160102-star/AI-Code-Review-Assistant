import express from "express";
import upload from "../config/multer.js";
import { protect } from "../middleware/auth.middleware.js";
import { uploadCode } from "../controllers/upload.controller.js";

const router = express.Router();

/**
 * Upload Code File
 * POST /api/upload
 */
router.post(
  "/",
  protect,
  upload.single("file"),
  uploadCode
);

export default router;