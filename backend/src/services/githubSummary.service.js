import { reviewCode } from "./gemini.service.js";

export const generateRepositorySummary = async (reviews) => {
  try {
    const combinedReviews = reviews
      .map(
        (review) =>
          `File: ${review.fileName}

${review.aiReview}`
      )
      .join("\n\n-------------------------\n\n");

    const prompt = `
You are a Senior Software Architect.

Based on the following AI code reviews of multiple files, generate a repository summary.

Include:

1. Overall Repository Score (/100)
2. Overall Code Quality
3. Main Strengths
4. Common Bugs
5. Security Issues
6. Performance Improvements
7. Best Practices
8. Final Conclusion

Respond in clean Markdown.

${combinedReviews}
`;

    return await reviewCode(prompt);
  } catch (error) {
    console.error("Repository Summary Error:", error);
    return "Unable to generate repository summary.";
  }
};