const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user.js");
const { JWT_SECRET } = require("../utils/config");
const { ERROR_CODES, ERROR_MESSAGES } = require("../utils/errors.js");
const mongoose = require("mongoose");
const UnauthorizedError = require("./errors/unauthorized-err");
const BadRequestError = require("./errors/bad-request-err");
const NotFoundError = require("./errors/not-found-err");
const ServerError = require("./errors/server-err.js");

function validateObject(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

const signUp = async (req, res, next) => {
  const { email, password, username } = req.body;

  if (!email || !password || !username) {
    return res
      .status(ERROR_CODES.BAD_REQUEST)
      .send({ message: "All fields are required." });
  }
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      password: hashedPassword,
      username,
    });
    const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(201).send({ token, username: user.username, email: user.email });
  } catch (err) {
    console.error(err);
    if (err.name === "ValidationError") {
      return next(new BadRequestError("Validation Error"));
    }

    return next(new ServerError("Server Error"));
  }
};

const signIn = async (req, res, next) => {
  const { email, password } = req.body;
  console.log("req.body:", req.body);

  if (!email || !password) {
    return next(new BadRequestError("Email and Password are required"));
  }
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      return res.send({ token });
    })
    .catch((err) => {
      if (err.message === "Incorrect email or password") {
        return next(new UnauthorizedError("Incorrect email or password"));
      }
      return next(err);
    });
};

const getCurrentUser = (req, res, next) => {
  const { _id } = req.user;

  if (!validateObject(_id)) {
    return next(new BadRequestError("Invalid Object ID"));
  }

  User.findById(_id)
    .orFail()
    .select("-password")
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("Cannot find the user"));
      }
      if (err.name === "CastError") {
        return next(new BadRequestError("CastError"));
      }
      return next(new ServerError("Server Error"));
    });
};

module.exports = { signUp, signIn, getCurrentUser };
