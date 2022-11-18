const db = require("../db/connection");

exports.selectAllCategories = async () => {
  const queryStr = "SELECT * FROM categories;";
  const result = await db.query(queryStr);
  return result.rows;
};
