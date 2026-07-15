import api from "./api";

export const reviewGithubRepository = async (repoUrl) => {
  const response = await api.post("/github/review", {
    repoUrl,
  });

  return response.data;
};