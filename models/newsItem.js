const mongoose = require("mongoose");
const validator = require("validator");

const articleSchema = new mongoose.Schema({
  source: {
    id: { type: String, default: null },
    name: { type: String, default: null },
  },
  author: { type: String, default: null },
  title: { type: String, required: true },
  description: { type: String, required: true },
  url: {
    type: String,
    required: true,
    validate: {
      validator(value) {
        return validator.isURL(value);
      },
      message: "You must enter a valid URL",
    },
  },
  urlToImage: {
    type: String,
    default: null,
    validate: {
      validator(value) {
        return validator.isURL(value);
      },
      message: "You must enter a valid URL",
    },
  },
  publishedAt: { type: Date, required: true },
  content: { type: String, default: null },
  saved: { type: Boolean, default: false },
  keyword: { type: String, default: null },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Article", articleSchema);
