const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const UnauthorizedError = require("../controllers/errors/unauthorized-err");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return next(
      new UnauthorizedError(
        "Authorization header missing or does not start with 'Bearer '"
      )
    );
  }
  const token = authorization.replace("Bearer ", "");

  let payload;

  try {
    const decodedToken = jwt.decode(token);

    if (!decodedToken) {
      throw new Error("Invalid token format");
    }
    payload = jwt.verify(token, JWT_SECRET);
    req.user = { _id: payload._id };
  } catch (err) {
    return next(
      new UnauthorizedError("Token verification failed: It is Unauthorized")
    );
  }
  req.user = payload;

  return next();
};
