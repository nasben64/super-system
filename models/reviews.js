const db = require("../db/connection");
const { checkReviewExists, checkCategoryExists } = require("../utils/utils");

exports.selectAllReviews = (
  sort_by = "created_at",
  order = "DESC",
  category
) => {
  const validColumns = [
    "title",
    "owner",
    "category",
    "created_at",
    "votes",
    "designer",
  ];
  if (!validColumns.includes(sort_by)) {
    return Promise.reject({ status: 400, message: "invalid sort query!" });
  }

  if (order !== "DESC" && order !== "ASC") {
    return Promise.reject({ status: 400, message: "invalid order value!" });
  }
  return checkCategoryExists(category)
    .then(() => {
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
      return db.query(queryStr, queryValues);
    })
    .then((result) => {
      return result.rows;
    });
};

exports.selectReviewById = (review_id) => {
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
  return db.query(queryStr, [review_id]).then((result) => {
    if (result.rows.length === 0) {
      return Promise.reject({
        status: 404,
        message: "review does not exist",
      });
    }
    return result.rows;
  });
};

exports.updateReviewById = (review_id, newVote) => {
  if (newVote === undefined) {
    return Promise.reject({
      status: 400,
      message: "inc_votes can not be undefined",
    });
  }
  return checkReviewExists(review_id)
    .then(() => {
      const queryStr = `
        UPDATE reviews
        SET votes = votes + $1
        WHERE review_id = $2 RETURNING*;`;
      return db.query(queryStr, [newVote, review_id]);
    })
    .then((result) => {
      return result.rows;
    });
};
