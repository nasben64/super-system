const {
  selectCommentsByReviewId,
  createCommentByReviewId,
  removeCommentById,
} = require("../models/comments");

exports.getCommentsByReviewId = (req, res, next) => {
  const { review_id } = req.params;

  selectCommentsByReviewId(review_id)
    .then((comments) => {
      return res.status(200).send({ comments });
    })
    .catch(next);
};

exports.postCommentByReviewId = (req, res, next) => {
  const newComment = req.body;
  const { review_id } = req.params;
  createCommentByReviewId(review_id, newComment)
    .then((comment) => {
      return res.status(201).send({ comment });
    })
    .catch(next);
};

exports.deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  removeCommentById(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};
