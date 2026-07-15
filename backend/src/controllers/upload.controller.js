import fs from "fs";
import path from "path";
import { reviewCode } from "../services/gemini.service.js";
import { createReview } from "../services/review.service.js";

/**
 * Upload Source Code File
 */
export const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded.",
      });
    }

    // Read uploaded file
    const filePath = path.resolve(req.file.path);
    const sourceCode = fs.readFileSync(filePath, "utf-8");

    // Detect language
    const extension = path.extname(req.file.originalname).replace(".", "");

    const aiReview = await reviewCode(sourceCode, extension);

    // Save Review in MongoDB
    const savedReview = await createReview({
      userId: req.user._id,
      fileName: req.file.originalname,
      language: extension,
      sourceCode,
      aiReview,
      score: 90,
    });

    return res.status(200).json({
      success: true,
      message: "AI Review Generated Successfully",
      data: savedReview,
    });

  } catch (error) {
    console.error("Upload Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};