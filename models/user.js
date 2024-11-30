const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    require: true,
    minlength: 2,
    maxlength: 30,
  },
  password: {
    type: String,
    require: true,
    select: false,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(value) {
        return validator.isEmail(value);
      },
      message: "You must enter a valid Email",
    },
  },
});

module.exports = mongoose.model("User", userSchema);
