// this middleware function will catch
// all of the invalid endpoints set their status
// to 404 and msg to 'Path not found'
// and then pass it to the custom built
// middleware error handler
exports.pathNotFoundError = (req, res, next) => {
  const err = new Error("Path not found");
  err.status = 404;
  next(err);
};

// this error handler will handle all of the
// error coming from the endpoints
exports.apiCustomError = (err, req, res, next) => {
  if (err.status && err.message) {
    res.status(err.status || 500).send({
      status: err.status || 500,
      msg: err.message,
    });
  } else {
    next(err);
  }
};

// this error handler will be called as the last in
// the app.js to catch any an unexpected errors including
// server errors
exports.catchAllErrors = (err, req, res, next) => {
  //console.log(err, "error coming from app.use");
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad Request" });
  } else {
    res.sendStatus(500);
  }
};
