import fs from "fs";
import path from "path";

import { reviewCode } from "../services/gemini.service.js";
import Review from "../models/review.model.js";

// Extract "Final Score" (0-100) from the AI markdown review
const extractScore = (text = "") => {
  const match =
    text.match(/Final Score[^\d]{0,30}(\d{1,3})/i) ||
    text.match(/(\d{1,3})\s*\/\s*100/);

  if (!match) return 0;

  return Math.min(100, Number(match[1]));
};

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

    const aiReview = await reviewCode(sourceCode);

    const score = extractScore(aiReview);

    const review = await Review.create({
      user: req.user._id,
      reviewedFiles: 1,
      totalFiles: 1,
      reviews: [
        {
          fileName: req.file.originalname,
          language,
          aiReview,
          score,
        },
      ],
    });

    // Delete uploaded temp file
    fs.unlinkSync(filePath);

    res.status(201).json({
      success: true,
      message: "Code reviewed successfully.",
      data: {
        _id: review._id,
        fileName: req.file.originalname,
        language,
        aiReview,
        score,
      },
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