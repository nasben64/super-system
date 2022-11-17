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
      return result.rows;
    });
};

exports.createCommentByReviewId = (review_id, { body, author }) => {
  return checkReviewExists(review_id)
    .then(() => {
      const queryStr = `INSERT INTO comments (body, author, review_id) 
    VALUES ($1, $2, $3 ) RETURNING *;`;
      return db.query(queryStr, [body, author, review_id]);
    })
    .then((result) => {
      return result.rows[0];
    });
};
