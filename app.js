const express = require("express");
const { getAllCategories } = require("./controllers/categories");

const app = express();

app.get("/api/categories", getAllCategories);

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Path not found" });
  //next(err);
});

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  res.sendStatus(500);
});

module.exports = app;
