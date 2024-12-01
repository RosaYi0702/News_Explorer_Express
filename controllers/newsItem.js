const Article = require("../models/newsItem");
const { ERROR_CODES, ERROR_MESSAGES } = require("../utils/errors");

const getNewsItems = (req, res) => {
  Article.find({ owner: req.user.userId })
    .then((items) => res.send({ items }))
    .catch((err) => {
      console.error(err);
      return res
        .status(ERROR_CODES.SERVER_ERROR)
        .send({ message: ERROR_MESSAGES.SERVER_ERROR });
    });
};

const saveNewsItem = (req, res) => {
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

  Article.findOne({ url, owner: req.user.userId })
    .then((existingArticle) => {
      if (existingArticle) {
        return res.status(409).send({ message: "Article already saved" });
      }

      const newsItem = new Article({
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
        owner: req.user.userId,
      });

      newsItem
        .save()
        .then((item) =>
          res
            .status(201)
            .send({ message: "News item saved successfully", item })
        )
        .catch((err) => {
          console.error(err);
          return res
            .status(ERROR_CODES.SERVER_ERROR)
            .send({ message: ERROR_MESSAGES.SERVER_ERROR });
        });
    })
    .catch((err) => {
      console.error(err);
      res
        .status(ERROR_CODES.SERVER_ERROR)
        .send({ message: ERROR_MESSAGES.SERVER_ERROR });
    });
};

const unsaveNewsItem = (req, res) => {
  const { id } = req.params;
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res
      .status(ERROR_CODES.BAD_REQUEST)
      .send({ message: ERROR_MESSAGES.BAD_REQUEST });
  }

  Article.findByIdAndRemove({ _id: id, owner: req.user.userId })
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
  Article.find({ owner: req.user.userId })
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
