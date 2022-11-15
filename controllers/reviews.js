const { selectAllReviews } = require("../models/reviews");

exports.getAllReviews = (req, res, next) => {
  selectAllReviews()
    .then((reviews) => {
      res.status(200).send(reviews);
    })
    .catch(next);
};
