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

exports.checkUserExists = (username) => {
  if (username === undefined) {
    return Promise.reject({ status: 400, message: "Bad Request" });
  }
  const queryStr = `SELECT * FROM users WHERE username = $1`;
  return db.query(queryStr, [username]).then((result) => {
    if (result.rows.length === 0) {
      return Promise.reject({ status: 404, message: "user not found!" });
    }
  });
};

exports.checkCategoryExists = (category) => {
  if (category !== undefined) {
    const queryStr = `SELECT * FROM categories WHERE slug = $1`;
    return db.query(queryStr, [category]).then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, message: "category not found!" });
      }
    });
  } else {
    return Promise.resolve();
  }
};
