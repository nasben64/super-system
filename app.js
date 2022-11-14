const express = require("express");
const { getAllCategories } = require("./controllers/categories");

const app = express();

app.get("/api/categories", getAllCategories);

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Path not found" });
  //next(err);
});

app.use((err, req, res, next) => {
  res.sendStatus(500);
});

module.exports = app;
