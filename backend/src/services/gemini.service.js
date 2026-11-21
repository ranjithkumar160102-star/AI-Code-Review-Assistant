import Groq from "groq-sdk";

console.log("================================");
console.log("Groq Key:", process.env.GROQ_API_KEY ? "Loaded " : "Missing ");
console.log("================================");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// ======================================
// Review Single File
// ======================================
export const reviewCode = async (sourceCode) => {
  try {
    console.log("================================");
    console.log("Calling Groq For File Review...");
    console.log("================================");

    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",

      messages: [
        {
          role: "system",
          content: `
You are a Senior Software Engineer.

Review ONLY this source code file.

Return your answer in Markdown.

Include:

# Code Quality
# Bugs
# Performance Improvements
# Security Issues
# Best Practices
# Suggested Improvements
# Final Score (/100)

Keep the answer below 250 words.
`,
        },
        {
          role: "user",
          content: sourceCode.substring(0, 12000),
        },
      ],

      temperature: 0.2,
      max_tokens: 2500,
    });

    console.log("================================");
    console.log("File Review Completed");
    console.log("================================");

    return completion.choices?.[0]?.message?.content || "No review generated.";
  } catch (error) {
    console.error("================================");
    console.error("Groq File Review Error");
    console.error(error.message || error);
    console.error("================================");

    throw error;
  }
};

// ======================================
// Repository Summary
// ======================================
export const reviewRepositorySummary = async (summaryText) => {
  try {
    console.log("================================");
    console.log("Generating Repository Summary...");
    console.log("Summary Length:", summaryText.length);
    console.log("================================");

    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",

      messages: [
        {
          role: "system",
          content: `
You are a Senior Software Architect.

Generate a concise repository summary.

Return Markdown only.

Include:

# Overall Repository Score (/100)

# Overall Code Quality

# Main Strengths

# Main Weaknesses

# Security Issues

# Performance Suggestions

# Final Conclusion

Keep the answer below 180 words.
`,
        },
        {
          role: "user",
          content: summaryText.substring(0, 15000),
        },
      ],

      temperature: 0.2,
      max_tokens: 2000,
    });

    console.log("================================");
    console.log("Repository Summary Completed");
    console.log("================================");

    return (
      completion.choices?.[0]?.message?.content ||
      "Repository summary not generated."
    );
  } catch (error) {
    console.error("================================");
    console.error("Repository Summary Error");
    console.error(error.message || error);
    console.error("================================");

    throw error;
  }
};