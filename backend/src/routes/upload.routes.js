import express from "express";
import upload from "../config/multer.js";
import { protect } from "../middleware/auth.middleware.js";
import { uploadFile } from "../controllers/upload.controller.js";

const router = express.Router();

// Upload source code file
router.post("/", protect, upload.single("codeFile"), uploadFile);

export default router;