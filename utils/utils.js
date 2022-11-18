const db = require("../db/connection.js");

// checks if the review exists
exports.checkReviewExists = async (review_id) => {
  const queryStr = `SELECT * FROM reviews WHERE review_id = $1`;
  const result = await db.query(queryStr, [review_id]);
  if (result.rows.length === 0) {
    await Promise.reject({ status: 404, message: "review not found!" });
  }
};

exports.checkUserExists = async (username) => {
  if (username === undefined) {
    await Promise.reject({ status: 400, message: "Bad Request" });
  }
  const queryStr = `SELECT * FROM users WHERE username = $1`;
  const result = await db.query(queryStr, [username]);

  if (result.rows.length === 0) {
    await Promise.reject({ status: 404, message: "user not found!" });
  }
};

exports.checkCategoryExists = async (category) => {
  if (category !== undefined) {
    const queryStr = `SELECT * FROM categories WHERE slug = $1`;
    const result = await db.query(queryStr, [category]);

    if (result.rows.length === 0) {
      await Promise.reject({ status: 404, message: "category not found!" });
    }
  } else {
    await Promise.resolve();
  }
};

exports.isValidOrder = async (order) => {
  const orderArr = ["ASC", "DESC"];

  if (!orderArr.includes(order.toUpperCase())) {
    await Promise.reject({
      status: 400,
      message: "invalid order value!",
    });
  }
};

exports.isValidSoryBy = async (sort_by) => {
  const validColumns = [
    "title",
    "owner",
    "category",
    "created_at",
    "votes",
    "designer",
  ];
  if (!validColumns.includes(sort_by)) {
    await Promise.reject({ status: 400, message: "invalid sort query!" });
  }
};
