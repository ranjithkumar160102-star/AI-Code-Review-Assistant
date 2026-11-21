import axios from "axios";
import { reviewCode, reviewRepositorySummary } from "./gemini.service.js";

const GITHUB_API = "https://api.github.com";

export const analyzeGithubRepository = async (repoUrl) => {
  try {
    // Validate URL
    const match = repoUrl.match(/github\.com\/([^/]+)\/([^/]+)/);

    if (!match) {
      throw new Error("Invalid GitHub Repository URL");
    }

    const owner = match[1];
    const repo = match[2].replace(".git", "");

    console.log("================================");
    console.log("Analyzing Repository...");
    console.log(`${owner}/${repo}`);
    console.log("================================");

    // Repository Info
    const repoResponse = await axios.get(
      `${GITHUB_API}/repos/${owner}/${repo}`
    );

    const repoData = repoResponse.data;

    // Repository Tree
    const treeResponse = await axios.get(
      `${GITHUB_API}/repos/${owner}/${repo}/git/trees/${repoData.default_branch}?recursive=1`
    );

    const tree = treeResponse.data.tree;

    // Supported source files
    const sourceFiles = tree.filter((item) => {
      return (
        item.type === "blob" &&
        /\.(js|jsx|ts|tsx|py|java|cpp|c|cs|php|go|rb|rs|swift|kt)$/i.test(
          item.path
        )
      );
    });

    console.log("Source Files:", sourceFiles.length);

    const reviews = [];

    // Review maximum 20 files
    for (const file of sourceFiles.slice(0, 20)) {
      try {
        console.log("Reviewing:", file.path);

        const fileResponse = await axios.get(
          `${GITHUB_API}/repos/${owner}/${repo}/contents/${file.path}`
        );

        const content = Buffer.from(
          fileResponse.data.content,
          "base64"
        ).toString("utf8");

        const aiReview = await reviewCode(content);

        // Score extraction
        let score = 80;

        const matchScore = aiReview.match(/(\d{1,3})\s*\/\s*100/);

        if (matchScore) {
          score = Number(matchScore[1]);
        }

        reviews.push({
          fileName: file.path,
          language:
            file.path.split(".").pop()?.toUpperCase() || "Unknown",
          score,
          aiReview,
        });
      } catch (err) {
        console.log("Skipped:", file.path);
      }
    }

    // Repository Summary
    const combinedReviews = reviews
      .map(
        (r) => `
=========================
File : ${r.fileName}
=========================

${r.aiReview}
`
      )
      .join("\n\n");

    const summary = await reviewRepositorySummary(combinedReviews);

    return {
      repoUrl,

      totalFiles: sourceFiles.length,

      reviewedFiles: reviews.length,

      repository: {
        name: repoData.name,
        description: repoData.description,
        language: repoData.language,
        stars: repoData.stargazers_count,
        forks: repoData.forks_count,
        issues: repoData.open_issues_count,
      },

      repositorySummary: summary,

      reviews,
    };
  } catch (error) {
    console.error(error);

    throw new Error(
      error.response?.data?.message || error.message
    );
  }
};