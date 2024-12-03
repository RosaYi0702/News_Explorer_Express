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

    console.log("req.body:", req.body);
    if (!title || !url || !publishedAt) {
      return res
        .status(ERROR_CODES.BAD_REQUEST)
        .send({ message: ERROR_MESSAGES.BAD_REQUEST });
    }

    const existingArticle = await Article.findOne({
      url,
      user: req.user._id,
    });

    if (existingArticle) {
      console.log("existingArticle:", existingArticle);
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
    console.error("Error saving news item:", err);
    return res
      .status(ERROR_CODES.SERVER_ERROR)
      .send({ message: ERROR_MESSAGES.SERVER_ERROR });
  }
};

const unsaveNewsItem = (req, res) => {
  const { id } = req.params;
  console.log("ussaneNewsItem.id", id);
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({ error: "Invalid ID format" });
  }

  Article.findByIdAndRemove({ _id: id, user: req.user._id })
    .orFail()
    .then((deletedArticle) => {
      if (!deletedArticle) {
        return res.status(404).send({ message: "Article not found" });
      }
      res.status(200).send({ message: "News item unsaved successful" });
    })
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(ERROR_CODES.NOT_FOUND)
          .send({ message: ERROR_MESSAGES.NOT_FOUND });
      }
      console.error("Error unsaving news item:", err);
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
