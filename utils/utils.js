const db = require("../db/connection.js");

// checks if the review exists
exports.checkReviewExists = (review_id) => {
  const queryStr = `SELECT * FROM reviews WHERE review_id = $1`;
  return db.query(queryStr, [review_id]).then((result) => {
    if (result.rows.length === 0) {
      return Promise.reject({ status: 404, message: "review not found!" });
    }
  });
};
