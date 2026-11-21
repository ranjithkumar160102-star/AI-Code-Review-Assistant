import Review from "../models/review.model.js";

/**
 * Get User Reviews
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

  // Search Repository
  if (search) {
    query.repoUrl = {
      $regex: search,
      $options: "i",
    };
  }

  // Language Filter
  if (language) {
    query["reviews.language"] = language;
  }

  // Sorting
  let sortOption = { createdAt: -1 };

  if (sort === "oldest") {
    sortOption = { createdAt: 1 };
  }

  const skip = (page - 1) * limit;

  const reviews = await Review.find(query)
    .sort(sortOption)
    .skip(skip)
    .limit(limit);

  const total = await Review.countDocuments(query);

  return {
    reviews,
    total,
    currentPage: page,
    totalPages: Math.ceil(total / limit),
  };
};

/**
 * Get Single Review
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
 * Dashboard Statistics
 */
export const getReviewStats = async (userId) => {
  const docs = await Review.find({ user: userId });

  let totalReviews = 0;
  let totalScore = 0;

  const languageMap = {};
  const scoreChart = [];

  docs.forEach((doc) => {
    if (!doc.reviews || doc.reviews.length === 0) return;

    doc.reviews.forEach((review, index) => {
      const score = Number(review.score || 0);

      totalReviews++;
      totalScore += score;

      const language = review.language || "Unknown";

      languageMap[language] =
        (languageMap[language] || 0) + 1;

      if (score > 0) {
  scoreChart.push({
    file: review.fileName || "Untitled",
    score,
  });
}
    });
  });

  const languageChart = Object.keys(languageMap).map(
    (language) => ({
      language,
      count: languageMap[language],
    })
  );

  const averageScore =
    totalReviews > 0
      ? Number((totalScore / totalReviews).toFixed(1))
      : 0;

  return {
    totalReviews,
    averageScore,
    languages: languageChart.length,
    recentReviews: docs.length,
    languageChart,
    scoreChart,
  };
};