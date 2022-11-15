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
  res.status(err.status || 500).send({
    status: err.status || 500,
    msg: err.message,
  });
};

exports.catchAllErrors = (err, req, res, next) => {
  console.log(err, "error coming from app.use");
  res.sendStatus(500);
};
