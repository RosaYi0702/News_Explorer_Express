const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const UnauthorizedError = require("../controllers/errors/unauthorized-err");

console.log("JWT_SECRET:", JWT_SECRET);

module.exports = (req, res, next) => {
  console.log("Request headers:", req.headers);
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return next(
      new UnauthorizedError(
        "Authorization header missing or does not start with 'Bearer '"
      )
    );
  }
  const token = authorization.replace("Bearer ", "");
  console.log("Received token:", token);
  let payload;

  try {
    const decodedToken = jwt.decode(token);
    console.log("Decoded token:", decodedToken);

    if (!decodedToken) {
      throw new Error("Invalid token format");
    }
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return next(
      new UnauthorizedError("Token verification failed: It is Unauthorized")
    );
  }
  req.user = payload;

  return next();
};
