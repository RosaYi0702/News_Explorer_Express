const router = require("express").Router();
const { signUp, signIn, getCurrentUser } = require("../controllers/users");

router.post("/signin", signIn);
router.get("/users/me", authenticate, getCurrentUser);
router.post("/signup", signUp);

module.exports = router;
