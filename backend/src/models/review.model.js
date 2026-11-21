import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // GitHub Repository URL
    repoUrl: {
      type: String,
      default: "",
    },

    // Repository Summary
    repositorySummary: {
      type: String,
      default: "",
    },

    // Statistics
    reviewedFiles: {
      type: Number,
      default: 0,
    },

    totalFiles: {
      type: Number,
      default: 0,
    },

    // Individual File Reviews
    reviews: [
      {
        fileName: {
          type: String,
          default: "",
        },

        language: {
          type: String,
          default: "",
        },

        aiReview: {
          type: String,
          default: "",
        },

        score: {
          type: Number,
          default: 0,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Review", reviewSchema);