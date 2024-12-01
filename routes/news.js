const router = require("express").Router();
const authenticate = require("../middleware/auth");
const {
  getSavedNewsItems,
  saveNewsItem,
  unsaveNewsItem,
} = require("../controllers/newsItem");

router.get("/saved", authenticate, getSavedNewsItems);
router.post("/saved", authenticate, saveNewsItem);
router.delete("/:id", authenticate, unsaveNewsItem);

module.exports = router;
