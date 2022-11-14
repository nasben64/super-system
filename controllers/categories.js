const { selectAllCategories } = require("../models/categories");

exports.getAllCategories = (req, res, next) => {
  selectAllCategories()
    .then((categories) => {
      res.status(200).send(categories);
    })
    .catch((err) => {
      console.log("controller error", err);
      next(err);
    });
};
