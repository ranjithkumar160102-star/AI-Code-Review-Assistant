import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    fileName: {
      type: String,
      default: "",
    },

    language: {
      type: String,
      required: true,
    },

    sourceCode: {
      type: String,
      required: true,
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
  {
    timestamps: true,
  }
);

export default mongoose.model("Review", reviewSchema);