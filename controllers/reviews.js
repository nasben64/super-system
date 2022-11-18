const {
  selectAllReviews,
  selectReviewById,
  updateReviewById,
} = require("../models/reviews");

exports.getAllReviews = async (req, res, next) => {
  try {
    const { sort_by, order, category } = req.query;
    const reviews = await selectAllReviews(sort_by, order, category);
    res.status(200).send({ reviews });
  } catch (err) {
    next(err);
  }
};

exports.getReviewById = async (req, res, next) => {
  try {
    const { review_id } = req.params;
    const review = await selectReviewById(review_id);
    res.status(200).send({ review });
  } catch (err) {
    next(err);
  }
};

exports.patchReviewById = async (req, res, next) => {
  try {
    const { review_id } = req.params;
    const { inc_votes } = req.body;
    const review = await updateReviewById(review_id, inc_votes);
    res.status(200).send({ review });
  } catch (err) {
    next(err);
  }
};
