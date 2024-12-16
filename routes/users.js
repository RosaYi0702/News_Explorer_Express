const router = require("express").Router();
const authenticate = require("../middleware/auth");
const { getCurrentUser } = require("../controllers/users");

router.get("/me", authenticate, getCurrentUser);

module.exports = router;
