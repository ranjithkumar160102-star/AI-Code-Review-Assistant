import fs from "fs";
import path from "path";

import { reviewCode } from "../services/gemini.service.js";
import Review from "../models/review.model.js";

export const uploadCode = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a source code file.",
      });
    }

    const filePath = req.file.path;

    const sourceCode = fs.readFileSync(filePath, "utf-8");

    const extension = path.extname(req.file.originalname);

    const language = extension.replace(".", "");

    console.log("=================================");
    console.log("Reviewing Uploaded File...");
    console.log(req.file.originalname);
    console.log("=================================");

    const aiReview = await reviewCode(sourceCode);

    const review = await Review.create({
      user: req.user._id,
      fileName: req.file.originalname,
      language,
      sourceCode,
      aiReview,
    });

    // Delete uploaded temp file
    fs.unlinkSync(filePath);

    res.status(201).json({
      success: true,
      message: "Code reviewed successfully.",
      data: review,
    });
  } catch (error) {
    console.error("Upload Review Error:", error);

    // Cleanup if file still exists
    if (req.file?.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};