const router = require("express").Router();
const { ERROR_CODES, ERROR_MESSAGES } = require("../utils/errors");
const { signIn, signUp } = require("../controllers/users");
const userRouter = require("./users");
const newsRouter = require("./news");
const authMiddleware = require("../middleware/auth");
const { getNewsItems } = require("../controllers/newsItem");

router.post("/signin", signIn);
router.post("/signup", signUp);
router.get("/news", getNewsItems);

router.use(authMiddleware);
router.use("/users", userRouter);
router.use("/news", newsRouter);

router.use((req, res) => {
  res.status(ERROR_CODES.NOT_FOUND).send({ message: ERROR_MESSAGES.NOT_FOUND });
});
module.exports = router;
