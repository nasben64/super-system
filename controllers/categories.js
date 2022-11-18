const { selectAllCategories } = require("../models/categories");

exports.getAllCategories = async (req, res, next) => {
  try {
    const categories = await selectAllCategories();

    res.status(200).send({ categories });
  } catch (err) {
    next(err);
  }
};
