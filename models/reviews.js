const db = require("../db/connection");
const {
  checkReviewExists,
  checkCategoryExists,
  isValidOrder,
  isValidSoryBy,
} = require("../utils/utils");
const {
  reviewNotExists,
  incVoteUndefined,
} = require("../error-handler/model-errors.js");

exports.selectAllReviews = async (
  sort_by = "created_at",
  order = "DESC",
  category
) => {
  await Promise.all([
    isValidSoryBy(sort_by),
    isValidOrder(order),
    checkCategoryExists(category),
  ]);

  const queryValues = [];
  let queryStr = `
      SELECT r.review_id, r.title, r.owner,
      r.category, r.review_img_url,
      r.created_at, r.votes, r.designer, 
      Count(c.review_id) AS comment_count
      FROM reviews r
      LEFT JOIN comments c USING(review_id)`;

  if (category) {
    queryValues.push(category);
    queryStr += ` WHERE r.category = $1`;
  }

  queryStr += ` GROUP BY r.review_id, r.title, r.owner,
      r.category, r.review_img_url,
      r.created_at, r.votes, r.designer
      ORDER BY ${sort_by} ${order};
    `;
  const result = await db.query(queryStr, queryValues);

  return result.rows;
};

exports.selectReviewById = async (review_id) => {
  const queryStr = `
    SELECT r.review_id, r.title, r.owner,
    r.category, r.review_img_url,
    r.created_at, r.votes, r.designer, 
    r.review_body,
    Count(c.review_id) AS comment_count
    FROM reviews r
    LEFT JOIN comments c USING(review_id)
    WHERE r.review_id = $1
    GROUP BY r.review_id, r.title, r.owner,
    r.category, r.review_img_url,
    r.created_at, r.votes, r.designer;
  `;
  const result = await db.query(queryStr, [review_id]);
  if (result.rows.length === 0) {
    await reviewNotExists();
  }
  return result.rows;
};

exports.updateReviewById = async (review_id, newVote) => {
  if (newVote === undefined) {
    await incVoteUndefined();
  }
  await checkReviewExists(review_id);

  const queryStr = `
        UPDATE reviews
        SET votes = votes + $1
        WHERE review_id = $2 RETURNING*;`;
  const result = await db.query(queryStr, [newVote, review_id]);

  return result.rows;
};
