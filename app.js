const express = require("express");
const { getAllCategories } = require("./controllers/categories");
const {
  getCommentsByReviewId,
  postCommentByReviewId,
} = require("./controllers/comments");
const { getAllReviews, getReviewById } = require("./controllers/reviews");
const {
  pathNotFoundError,
  apiCustomError,
  catchAllErrors,
} = require("./error-handler/app-errors");

const app = express();
app.use(express.json());

app.get("/api/categories", getAllCategories);

app.get("/api/reviews", getAllReviews);

app.get("/api/reviews/:review_id", getReviewById);

app.get("/api/reviews/:review_id/comments", getCommentsByReviewId);

app.post("/api/reviews/:review_id/comments", postCommentByReviewId);

app.use(pathNotFoundError);

app.use(apiCustomError);

app.use(catchAllErrors);

module.exports = app;
