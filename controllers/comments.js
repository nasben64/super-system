const {
  selectCommentsByReviewId,
  createCommentByReviewId,
  removeCommentById,
} = require("../models/comments");

exports.getCommentsByReviewId = async (req, res, next) => {
  try {
    const { review_id } = req.params;
    const comments = await selectCommentsByReviewId(review_id);
    return res.status(200).send({ comments });
  } catch (err) {
    next(err);
  }
};

exports.postCommentByReviewId = async (req, res, next) => {
  try {
    const newComment = req.body;
    const { review_id } = req.params;
    const comment = await createCommentByReviewId(review_id, newComment);
    return res.status(201).send({ comment });
  } catch (err) {
    next(err);
  }
};

exports.deleteCommentById = async (req, res, next) => {
  try {
    const { comment_id } = req.params;
    await removeCommentById(comment_id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
