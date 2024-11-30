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

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      if (!user) {
      }
      res.send(users);
    })
    .catch((err) => {
      console.error(err);
      return next(new ServerError("Server Error"));
    });
};

const signUp = async (req, res, next) => {
  const { email, password, username } = req.body;

  if (!email || !password || !username) {
    return res
      .status(ERROR_CODES.BAD_REQUEST)
      .send({ message: "All fields are required." });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      password: hashedPassword,
      username,
    });
    const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "7d" });

    res.status(201).send({ token, username: user.username, email: user.email });
  } catch (err) {
    console.error(err);
    if (err.name === "ValidationError") {
      return next(new BadRequestError("Validation Error"));
    }

    if (err.code === 11000) {
      return res.status(409).send({ message: "Email already exists." });
    }

    return next(new ServerError("Server Error"));
  }
};

const signIn = async (req, res, next) => {
  const { email, password } = req.body;
  console.log("Incoming request:", req.body);

  if (!email || !password) {
    return next(new BadRequestError("Email and Password are required"));
  }
  try {
    const user = await User.findOne({ email }).orFail();
    if (!user) {
      return next(new UnauthorizedError("Invalid Email and Password"));
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return next(new UnauthorizedError("Wrong Email or Password"));
    }
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "7d",
    });
    res.status(200).send({ token });
  } catch (err) {
    console.error(err);
    if (err.name === "DocumentNotFoundError") {
      return next(new UnauthorizedError("Cannot find the user"));
    }
    return next(new ServerError("Server Error"));
  }
};

const getCurrentUser = (req, res, next) => {
  const { userId } = req.user;

  if (!validateObject(userId)) {
    return next(new BadRequestError("Invalid Object ID"));
  }

  User.findById(userId)
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

module.exports = { getUsers, signUp, signIn, getCurrentUser };
