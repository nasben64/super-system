const db = require("../db/connection");
const { checkReviewExists } = require("../utils/utils");

exports.selectCommentsByReviewId = (review_id) => {
  return checkReviewExists(review_id)
    .then(() => {
      const queryStr = `SELECT * 
        FROM comments
        WHERE review_id = $1
        ORDER BY created_at DESC`;
      return db.query(queryStr, [review_id]);
    })
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({
          status: 404,
          message: "comment does not exist",
        });
      }
      return result.rows;
    });
};
