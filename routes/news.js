const router = require("express").Router();
const {
  getNewsItems,
  saveNewsItem,
  unsaveNewsItem,
} = require("../controllers/newsItem");

router.get("/articles", authenticate, getNewsItems);
router.post("/articles", authenticate, saveNewsItem);
router.delete("/articles/:articleId", authenticate, unsaveNewsItem);

module.exports = router;
