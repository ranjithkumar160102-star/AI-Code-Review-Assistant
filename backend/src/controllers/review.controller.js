import {
  getUserReviews,
  getReviewById,
  deleteReview,
  getReviewStats,
} from "../services/review.service.js";

/**
 * Get All Reviews
 */
export const getReviews = async (req, res) => {
  try {
    const {
      search = "",
      language = "",
      sort = "latest",
      page = 1,
      limit = 5,
    } = req.query;

    const result = await getUserReviews(
      req.user._id,
      search,
      language,
      sort,
      Number(page),
      Number(limit)
    );

    res.status(200).json({
      success: true,
      data: result.reviews,
      pagination: {
        total: result.total,
        currentPage: result.currentPage,
        totalPages: result.totalPages,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get Single Review
 */
export const getReview = async (req, res) => {
  try {
    const review = await getReviewById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    res.status(200).json({
      success: true,
      data: review,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Delete Review
 */
export const removeReview = async (req, res) => {
  try {
    const deleted = await deleteReview(
      req.params.id,
      req.user._id
    );

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Dashboard Statistics
 */
export const getStats = async (req, res) => {
  try {
    const stats = await getReviewStats(req.user._id);

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};