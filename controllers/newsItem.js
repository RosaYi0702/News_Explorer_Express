const NewsItems = require("../models/newsItem");
const { ERROR_CODES, ERROR_MESSAGES } = require("../utils/errors");

const getNewsItems = (req, res) => {
  NewsItems.find({ owner: req.user.userId })
    .then((items) => res.send({ items }))
    .catch((err) => {
      console.error(err);
      return res
        .status(ERROR_CODES.SERVER_ERROR)
        .send({ message: ERROR_MESSAGES.SERVER_ERROR });
    });
};

const toggleNewsItemSaveStatus = (req, res, saveStatus) => {
  const { itemId } = req.params;

  if (!itemId.match(/^[0-9a-fA-F]{24}$/)) {
    return res
      .status(ERROR_CODES.BAD_REQUEST)
      .send({ message: ERROR_MESSAGES.BAD_REQUEST });
  }

  NewsItems.findByIdAndUpdate(itemId, { saved: saveStatus }, { new: true })
    .orFail()
    .then((item) => {
      const action = saveStatus ? "saved" : "unsaved";
      res.status(200).send({ message: `item ${action} successful`, item });
    })
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(ERROR_CODES.NOT_FOUND)
          .send({ message: ERROR_MESSAGES.NOT_FOUND });
      }
      if (err.name === "CastError") {
        return res
          .status(ERROR_CODES.BAD_REQUEST)
          .send({ message: ERROR_MESSAGES.BAD_REQUEST });
      }

      return res
        .status(ERROR_CODES.SERVER_ERROR)
        .send({ message: ERROR_MESSAGES.SERVER_ERROR });
    });
};

const saveNewsItem = (req, res) => toggleNewsItemSaveStatus(req, res, true);
const unsaveNewsItem = (req, res) => toggleNewsItemSaveStatus(req, res, false);

module.exports = {
  getNewsItems,
  saveNewsItem,
  unsaveNewsItem,
};
