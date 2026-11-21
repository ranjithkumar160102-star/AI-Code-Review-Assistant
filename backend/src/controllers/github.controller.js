import { analyzeGithubRepository } from "../services/github.service.js";

export const reviewGithubRepository = async (req, res) => {
  try {
    const { repoUrl } = req.body;

    if (!repoUrl) {
      return res.status(400).json({
        success: false,
        message: "Repository URL is required",
      });
    }

    const result = await analyzeGithubRepository(repoUrl);

    return res.status(200).json({
      success: true,
      message: "Repository analyzed successfully",
      data: result,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};