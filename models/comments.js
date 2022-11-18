const db = require("../db/connection");
const { checkReviewExists, checkUserExists } = require("../utils/utils");
const { commentIdNotExists } = require("../error-handler/model-errors.js");

exports.selectCommentsByReviewId = async (review_id) => {
  await checkReviewExists(review_id);

  const queryStr = `SELECT * 
        FROM comments
        WHERE review_id = $1
        ORDER BY created_at DESC`;
  const result = await db.query(queryStr, [review_id]);

  return result.rows;
};

exports.createCommentByReviewId = async (review_id, { body, username }) => {
  await Promise.all([checkReviewExists(review_id), checkUserExists(username)]);

  const queryStr = `INSERT INTO comments (body, author, review_id) 
            VALUES ($1, $2, $3 ) RETURNING *;`;
  const result = await db.query(queryStr, [body, username, review_id]);

  return result.rows[0];
};

exports.removeCommentById = async (comment_id) => {
  const result = await db.query(
    `DELETE FROM comments 
            WHERE comment_id = $1 RETURNING*;`,
    [comment_id]
  );
  if (result.rows.length === 0) {
    await commentIdNotExists();
  }
};
