import api from "./api";

export const getReviews = async (
  search = "",
  language = "",
  sort = "latest",
  page = 1,
  limit = 5
) => {
  const response = await api.get("/reviews", {
    params: {
      search,
      language,
      sort,
      page,
      limit,
    },
  });

  return response.data;
};

export const getReview = async (id) => {
  const response = await api.get(`/reviews/${id}`);
  return response.data;
};

export const deleteReview = async (id) => {
  const response = await api.delete(`/reviews/${id}`);
  return response.data;
};

export const getDashboardStats = async () => {
  const response = await api.get("/reviews/stats");
  return response.data.data;
};