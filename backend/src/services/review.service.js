import Review from "../models/review.model.js";

/**
 * Create a new code review
 */
export const createReview = async ({
  userId,
  fileName,
  language,
  sourceCode,
  aiReview,
  score,
}) => {
  const review = await Review.create({
    user: userId,
    fileName,
    language,
    sourceCode,
    aiReview,
    score,
  });

  return review;
};

/**
 * Get all reviews of logged-in user
 */
export const getUserReviews = async (
  userId,
  search = "",
  language = "",
  sort = "latest",
  page = 1,
  limit = 5
) => {
  const query = {
    user: userId,
  };

  if (search) {
    query.fileName = {
      $regex: search,
      $options: "i",
    };
  }

  if (language) {
    query.language = language;
  }

  let sortOption = {
    createdAt: -1,
  };

  if (sort === "oldest") {
    sortOption = {
      createdAt: 1,
    };
  }

  if (sort === "score") {
    sortOption = {
      score: -1,
    };
  }

  const total = await Review.countDocuments(query);

  const reviews = await Review.find(query)
    .sort(sortOption)
    .skip((page - 1) * limit)
    .limit(limit);

  return {
    reviews,
    total,
    currentPage: Number(page),
    totalPages: Math.ceil(total / limit),
  };
};

/**
 * Get single review
 */
export const getReviewById = async (reviewId) => {
  return await Review.findById(reviewId);
};

/**
 * Delete Review
 */
export const deleteReview = async (reviewId, userId) => {
  return await Review.findOneAndDelete({
    _id: reviewId,
    user: userId,
  });
};

/**
 * Dashboard Analytics
 */
export const getReviewStats = async (userId) => {
  const reviews = await Review.find({ user: userId });

  const totalReviews = reviews.length;

  const averageScore =
    totalReviews === 0
      ? 0
      : Math.round(
          reviews.reduce((sum, review) => sum + review.score, 0) /
            totalReviews
        );

  const languagesUsed = new Set(
    reviews.map((review) => review.language)
  ).size;

  const today = new Date().toDateString();

  const todayReviews = reviews.filter(
    (review) =>
      new Date(review.createdAt).toDateString() === today
  ).length;

  return {
    totalReviews,
    averageScore,
    languagesUsed,
    todayReviews,
  };
};