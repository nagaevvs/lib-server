const express = require("express");

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

const PORT = process.env.PORT || 5000;
app.listen(PORT);
