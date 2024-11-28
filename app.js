const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
require("dotenv").config();
const { errors } = require("celebrate");
const limiter = require("./middleware/limiter");
const mainRouter = require("./routes/index");
const errorHandler = require("./middleware/error-handler");
const { requestLogger, errorLogger } = require("./middleware/logger");

const app = express();
const { PORT = 3001 } = process.env;

mongoose.set("strictQuery", true);

mongoose
  .connect("mongodb://127.0.0.1:27017/news_db")
  .then(() => {
    console.log("Connect to DB");
  })
  .catch(console.error);

app.use(requestLogger);
app.use(cors());
app.use(express.json());
app.use(limiter);
app.use(helmet());
app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});
app.use("/", mainRouter);
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
