module.exports = (err, req, res, next) => {
  console.error(err);
  const { statusCode = 500, message = "Internal Server Error" } = err;
  res.status(statusCode).send({ message });

  next();
};
