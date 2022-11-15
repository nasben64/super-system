const express = require("express");
const { getAllCategories } = require("./controllers/categories");
const { getAllReviews } = require("./controllers/reviews");
const {
  pathNotFoundError,
  apiCustomError,
  catchAllErrors,
} = require("./error-handler/app-errors");

const app = express();

app.get("/api/categories", getAllCategories);

app.get("/api/reviews", getAllReviews);

app.use(pathNotFoundError);

app.use(apiCustomError);

app.use(catchAllErrors);

module.exports = app;
