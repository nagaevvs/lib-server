const express = require("express");
const mongoose = require("mongoose");

const logger = require("./middleware/logger");
const error404 = require("./middleware/err-404");
const indexRouter = require("./routes/index");
const demoRouter = require("./routes/demo");
const booksRouter = require("./routes/api/books");
const userRouter = require("./routes/api/user");
const viewRouter = require("./routes/view");
const createRouter = require("./routes/create");
const updateRouter = require("./routes/update");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.use(logger);
//app.use(error404);
app.use("/", indexRouter);
app.use("/view", viewRouter);
app.use("/create", createRouter);
app.use("/update", updateRouter);

app.use("/demo", demoRouter);
app.use("/api/books", booksRouter);
app.use("/api/user", userRouter);
app.use("/public", express.static(`${__dirname}/public`));

async function startServer(PORT, UrlDB) {
  try {
    await mongoose.connect(UrlDB, {
      user: process.env.DB_USERNAME || "root",
      pass: process.env.DB_PASSWORD || "example",
      dbName: process.env.DB_NAME || "library",
      //useNewUrlParser: true,
      //useUnifiedTopology: true,
    });
    app.listen(PORT, () => {
      console.log(`Server listen port: ${PORT}`);
    });
  } catch (e) {
    console.log(e);
  }
}

const UrlDB = process.env.UrlDB || "mongodb://root:example@mongo:27017/";
const PORT = process.env.PORT || 5000;

startServer(PORT, UrlDB);
