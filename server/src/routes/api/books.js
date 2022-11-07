const express = require("express");
const router = express.Router();
const { v4: uuid } = require("uuid");
const fileMulter = require("../../middleware/file");
const path = require("path");
const lib = require("../../public/context/lib");

const Books = require("../../models/books");

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

//получаем массив всех книг
router.get("/", (req, res) => {
  Books.find({}).exec(function (err, books) {
    if (err) throw err;
    res.json(books);
    console.log(books);
  });
});

//получаем объект книги, если запись не найдено вернем Code: 404
router.get("/:_id", (req, res) => {
  const { _id } = req.params;

  Books.findById(_id, function (err, book) {
    if (err) throw err;
    res.json(book);
  });
});

//Загрузить файл
router.post(
  "/:id/upload",
  fileMulter.single("books-file"),
  async (req, res) => {
    const { id } = req.params;
    const { path, filename } = req.file;
    try {
      const updateImage = await Books.findByIdAndUpdate(
        id,
        { fileBook: path, fileName: filename },
        { new: true }
      );
      res.json(updateImage);
    } catch (e) {
      res.status(404).json({ errcode: 404, errmsg: e });
    }

    res.json();
  }
);

//скачать файл
router.get("/:_id/download", async (req, res) => {
  const { _id } = req.params;

  try {
    Books.findById(_id, function (err, book) {
      if (err) throw err;

      res.download(path.join(book.fileBook), book.fileName);
    });
  } catch (e) {
    res.json(e);
  }
});

//создаем книги и возврашаем ее же вместе с присвоенным id
router.post("/", async (req, res) => {
  const { title, description, authors } = req.body;
  const newBook = new Books({ title, description, authors });

  try {
    await newBook.save();
    res.json(req.body);

    //res.redirect("/");
  } catch (e) {
    res.status(500).json(e);
  }
});

//редактируем объект книги, если запись не найдено вернем Code: 404
router.put("/:id", async (req, res) => {
  const { title, description, authors } = req.body;
  const { id } = req.params;
  try {
    const newBook = await Books.findByIdAndUpdate(
      id,
      { title: title, description: description, authors: authors },
      { new: true }
    );
    res.json(newBook);
  } catch (e) {
    res.status(500).json(e);
  }
});

//удаляем книгу и возвращаем ответ: 'ok'
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  Books.findByIdAndDelete(id, function (err, doc) {
    if (err) return console.log(err);
    res.json("Удалена книга");
    console.log("Удален пользователь ", doc);
  });
});

module.exports = router;
