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
