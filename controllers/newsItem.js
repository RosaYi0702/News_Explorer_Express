const Article = require("../models/newsItem");
const { ERROR_CODES, ERROR_MESSAGES } = require("../utils/errors");

const getNewsItems = (req, res) => {
  Article.find({ user: req.user._id })
    .then((items) => res.send({ items }))
    .catch((err) => {
      console.error(err);
      return res
        .status(ERROR_CODES.SERVER_ERROR)
        .send({ message: ERROR_MESSAGES.SERVER_ERROR });
    });
};

const saveNewsItem = async (req, res) => {
  try {
    const {
      source,
      author,
      title,
      description,
      url,
      urlToImage,
      publishedAt,
      content,
      keyword,
    } = req.body;

    if (!source?.id || !source?.name || !title || !url || !publishedAt) {
      return res
        .status(ERROR_CODES.BAD_REQUEST)
        .send({ message: ERROR_MESSAGES.BAD_REQUEST });
    }

    const existingArticle = await Article.findOne({
      url,
      user: req.user._id,
    });

    if (existingArticle) {
      return res.status(409).send({ message: "Article already saved" });
    }

    const newsItem = await Article.create({
      source,
      author,
      title,
      description,
      url,
      urlToImage,
      publishedAt,
      content,
      saved: true,
      keyword,
      user: req.user._id,
    });

    return res
      .status(201)
      .send({ message: "News item saved successfully", item: newsItem });
  } catch (err) {
    console.error(err);
    return res
      .status(ERROR_CODES.SERVER_ERROR)
      .send({ message: ERROR_MESSAGES.SERVER_ERROR });
  }
};

const unsaveNewsItem = (req, res) => {
  const { id } = req.params;
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res
      .status(ERROR_CODES.BAD_REQUEST)
      .send({ message: ERROR_MESSAGES.BAD_REQUEST });
  }

  Article.findByIdAndRemove({ _id: id, user: req.user._id })
    .orfail()
    .then(() =>
      res.status(200).send({ message: "News item unsaved successful" })
    )
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(ERROR_CODES.NOT_FOUND)
          .send({ message: ERROR_MESSAGES.NOT_FOUND });
      }
      return res
        .status(ERROR_CODES.SERVER_ERROR)
        .send({ message: ERROR_MESSAGES.SERVER_ERROR });
    });
};

const getSavedNewsItems = (req, res) => {
  Article.find({ user: req.user._id, saved: true })
    .then((items) => res.send({ items }))
    .catch((err) => {
      console.error(err);
      return res
        .status(ERROR_CODES.SERVER_ERROR)
        .send({ message: ERROR_MESSAGES.SERVER_ERROR });
    });
};
module.exports = {
  getNewsItems,
  saveNewsItem,
  unsaveNewsItem,
  getSavedNewsItems,
};
