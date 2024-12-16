const ERROR_CODES = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
  CONFLICT: 409,
};

const ERROR_MESSAGES = {
  BAD_REQUEST: "Invalid data provided",
  UNAUTHORIZED: "Unauthorized",
  FORBIDDEN: "You don't have permission",
  NOT_FOUND: "Resource not found",
  SERVER_ERROR: "Internal server error",
  CONFLICT: "Email already exists",
};

module.exports = { ERROR_CODES, ERROR_MESSAGES };
