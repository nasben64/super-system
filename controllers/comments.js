const { selectCommentsByReviewId } = require("../models/comments");

exports.getCommentsByReviewId = (req, res, next) => {
  const { review_id } = req.params;

  selectCommentsByReviewId(review_id)
    .then((comments) => {
      return res.status(200).send({ comments });
    })
    .catch(next);
};
