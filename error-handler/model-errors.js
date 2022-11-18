exports.reviewNotExists = async () => {
  await Promise.reject({
    status: 404,
    message: "review does not exist",
  });
};

exports.incVoteUndefined = async () => {
  await Promise.reject({
    status: 400,
    message: "inc_votes can not be undefined",
  });
};

exports.commentIdNotExists = async () => {
  await Promise.reject({
    status: 404,
    message: "comment id does not exist!",
  });
};
