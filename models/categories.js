const db = require("../db/connection");

exports.selectAllCategories = () => {
  const queryStr = "SELECT * FROM categories;";
  return db.query(queryStr).then((result) => {
    return result.rows;
  });
};


