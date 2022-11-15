const db = require("../db/connection");

exports.selectAllReviews = () => {
  const queryStr = `
      SELECT r.review_id, r.title, r.owner,
      r.category, r.review_img_url,
      r.created_at, r.votes, r.designer, 
      Count(c.review_id) AS comment_count
      FROM reviews r
      LEFT JOIN comments c USING(review_id)
      GROUP BY r.review_id, r.title, r.owner,
      r.category, r.review_img_url,
      r.created_at, r.votes, r.designer
      ORDER BY r.created_at DESC;
    `;
  return db.query(queryStr).then((result) => {
    return result.rows;
  });
};

exports.selectReviewById = (review_id) => {
  const queryStr = `
    SELECT * 
    FROM reviews
    WHERE review_id = $1
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
