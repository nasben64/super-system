const db = require("../db/connection");

exports.selectAllUsers = () => {
  const queryStr = "SELECT * FROM users;";
  return db.query(queryStr).then((result) => {
    return result.rows;
  });
};
