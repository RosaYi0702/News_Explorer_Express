const router = require("express").Router();
const authenticate = require("../middleware/auth");
const {
  getNewsItems,
  saveNewsItem,
  unsaveNewsItem,
} = require("../controllers/newsItem");

router.get("/articles", authenticate, getNewsItems);
router.post("/articles", authenticate, saveNewsItem);
router.delete("/articles/:id", authenticate, unsaveNewsItem);

module.exports = router;
