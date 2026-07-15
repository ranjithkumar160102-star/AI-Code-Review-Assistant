import Groq from "groq-sdk";

console.log("================================");
console.log("Groq Key:", process.env.GROQ_API_KEY);
console.log("================================");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const reviewCode = async (sourceCode) => {
  try {
    console.log("Calling Groq...");

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `
You are a Senior Software Engineer.

Review the user's code and provide:
1. Code Quality
2. Bugs
3. Performance Improvements
4. Security Issues
5. Best Practices
6. Suggested Improved Code
7. Final Score out of 100

Respond in clean markdown.
          `,
        },
        {
          role: "user",
          content: sourceCode,
        },
      ],
      temperature: 0.2,
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error("Groq Error:", error);
    throw error;
  }
};