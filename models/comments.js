const db = require("../db/connection");
const { checkReviewExists, checkUserExists } = require("../utils/utils");

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

exports.createCommentByReviewId = (review_id, { body, username }) => {
  return Promise.all([checkReviewExists(review_id), checkUserExists(username)])
    .then(() => {
      const queryStr = `INSERT INTO comments (body, author, review_id) 
            VALUES ($1, $2, $3 ) RETURNING *;`;
      return db.query(queryStr, [body, username, review_id]);
    })
    .then((result) => {
      return result.rows[0];
    });
};

exports.removeCommentById = (comment_id) => {
  return db
    .query("DELETE FROM comments WHERE comment_id = $1 RETURNING*;", [
      comment_id,
    ])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          message: "comment id does not exist!",
        });
      }
    });
};
