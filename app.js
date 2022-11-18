const express = require("express");
const { getAllCategories } = require("./controllers/categories.js");
const {
  getCommentsByReviewId,
  postCommentByReviewId,
} = require("./controllers/comments.js");
const {
  getAllReviews,
  getReviewById,
  patchReviewById,
} = require("./controllers/reviews.js");
const {
  pathNotFoundError,
  apiCustomError,
  catchAllErrors,
} = require("./error-handler/app-errors");
const { getAllUsers } = require("./controllers/users.js");

const app = express();
app.use(express.json());

app.get("/api/categories", getAllCategories);

app.get("/api/reviews", getAllReviews);

app.get("/api/reviews/:review_id", getReviewById);

app.get("/api/reviews/:review_id/comments", getCommentsByReviewId);

app.post("/api/reviews/:review_id/comments", postCommentByReviewId);

app.patch("/api/reviews/:review_id", patchReviewById);

app.get("/api/users", getAllUsers);

// Error midleware functions

app.use(pathNotFoundError);

app.use(apiCustomError);

app.use(catchAllErrors);

module.exports = app;
