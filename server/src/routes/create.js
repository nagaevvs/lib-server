const express = require("express");
const router = express.Router();
const lib = require("../public/context/lib");
const { v4: uuid } = require("uuid");

class Book {
  constructor(
    title = "",
    description = "",
    authors = "",
    favorite = "",
    fileCover = "",
    fileName = "",
    fileBook = "",
    id = uuid()
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.authors = authors;
    this.favorite = favorite;
    this.fileCover = fileCover;
    this.fileName = fileName;
    this.fileBook = fileBook;
  }
}

router.get("/", (req, res) => {
  res.render("create", {
    lib: lib.books,
  });
});

//создаем книги и возврашаем ее же вместе с присвоенным id
router.post("/", (req, res) => {
  const { books } = lib;
  const { title, description, authors } = req.body;
  const newBook = new Book(title, description, authors);
  books.push(newBook);
  res.redirect("/");
});

module.exports = router;
