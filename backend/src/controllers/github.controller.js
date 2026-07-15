import { reviewCode } from "../services/gemini.service.js";
import { generateRepositorySummary } from "../services/githubSummary.service.js";
import simpleGit from "simple-git";
import fs from "fs";
import path from "path";


export const reviewGithubRepo = async (req, res) => {
console.log("===== reviewGithubRepo called =====");
  try {
    const { repoUrl } = req.body;

    if (!repoUrl) {
      return res.status(400).json({
        success: false,
        message: "Repository URL is required",
      });
    }

    // Create temp folder if not exists
    if (!fs.existsSync("temp")) {
      fs.mkdirSync("temp");
    }

    const repoName = Date.now().toString();
    const clonePath = path.join("temp", repoName);

    const git = simpleGit();

    console.log("Cloning repository...");
    await git.clone(repoUrl, clonePath);
    console.log("Clone completed.");

    const files = [];
    const sourceFiles = [];

    const allowedExtensions = [
      ".js",
      ".jsx",
      ".ts",
      ".tsx",
      ".py",
      ".java",
      ".cpp",
      ".c",
      ".cs",
      ".php",
      ".go",
      ".rb",
    ];

    const readFiles = (dir) => {
      const items = fs.readdirSync(dir);

      for (const item of items) {
        const fullPath = path.join(dir, item);

        if (fs.statSync(fullPath).isDirectory()) {
          if (
            item !== ".git" &&
            item !== "node_modules" &&
            item !== "dist" &&
            item !== "build"
          ) {
            readFiles(fullPath);
          }
        } else {
          const relativePath = path.relative(clonePath, fullPath);

          files.push(relativePath);

          const extension = path.extname(fullPath);

          if (allowedExtensions.includes(extension)) {
            const sourceCode = fs.readFileSync(
              fullPath,
              "utf-8"
            );

            sourceFiles.push({
              fileName: relativePath,
              language: extension.replace(".", ""),
              sourceCode,
            });
          }
        }
      }
    };

    console.log("Reading files...");
    readFiles(clonePath);
    console.log("Reading completed.");

   console.log(sourceFiles[0]);
console.log("Source Files:", sourceFiles.length);


  const firstTenFiles = sourceFiles.slice(0, 1);
const reviews = [];

for (const file of firstTenFiles) {
  console.log("Reviewing:", file.fileName);

  const aiReview = await reviewCode(file.sourceCode);

  reviews.push({
    fileName: file.fileName,
    language: file.language,
    aiReview,
  });
}

const repositorySummary = await generateRepositorySummary(reviews);

res.status(200).json({
  success: true,
  reviewedFiles: reviews.length,
  reviews,
  repositorySummary,
});

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};