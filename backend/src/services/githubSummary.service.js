import { reviewRepositorySummary } from "./gemini.service.js";

export const generateRepositorySummary = async (reviews) => {
  try {
    console.log("================================");
    console.log("Preparing Repository Summary...");
    console.log("================================");

    // Combine all file reviews
    const combinedReviews = reviews
      .map(
        (review) => `
========================================
File: ${review.fileName}
========================================

${review.aiReview}
`
      )
      .join("\n\n");

    console.log("Combined Reviews Length:", combinedReviews.length);

    // Generate repository summary
    const summary = await reviewRepositorySummary(combinedReviews);

    console.log("================================");
    console.log("Repository Summary Generated Successfully");
    console.log("================================");

    return summary;
  } catch (error) {
    console.error("================================");
    console.error("Repository Summary Error");
    console.error(error);
    console.error("================================");

    return `
# Repository Summary

Unable to generate repository summary.

Reason:
${error.message}
`;
  }
};