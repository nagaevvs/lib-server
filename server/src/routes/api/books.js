const express = require("express");
const router = express.Router();
const { v4: uuid } = require("uuid");
const fileMulter = require("../../middleware/file");
const path = require("path");
const lib = require("../../public/context/lib");

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
  const { books } = lib;
  res.json(books);
});

//получаем объект книги, если запись не найдено вернем Code: 404
router.get("/:id", (req, res) => {
  const { books } = lib;
  const { id } = req.params;
  const idx = books.findIndex((el) => el.id === id);

  if (idx !== -1) {
    res.json(books[idx]);
  } else {
    res.status(404);
    res.json({ errcode: 404, errmsg: "Запись не найдена" });
  }
});

//Загрузить файл
router.post("/:id/upload", fileMulter.single("books-file"), (req, res) => {
  const { books } = lib;
  const { id } = req.params;
  const idx = books.findIndex((el) => el.id === id);
  if (req.file) {
    const { path, filename } = req.file;
    if (idx !== -1) {
      books[idx].fileBook = path;
      books[idx].fileName = filename;
      res.json(books[idx]);
    } else {
      res.status(404);
      res.json({ errcode: 404, errmsg: "Запись не найдена" });
    }

    res.json({ path });
  }
  res.json();
});

//скачать файл
router.get("/:id/download", (req, res) => {
  const { books } = lib;
  const { id } = req.params;
  const idx = books.findIndex((el) => el.id === id);

  if (idx !== -1) {
    res.download(path.join(books[idx].fileBook), books[idx].fileName);
  } else {
    res.status(404);
    res.json({ errcode: 404, errmsg: "Запись не найдена" });
  }
});

//создаем книги и возврашаем ее же вместе с присвоенным id
router.post("/", (req, res) => {
  const { books } = lib;
  const { title, description } = req.body;
  const newBook = new Book(title, description);
  books.push(newBook);
  res.status(201);
  res.json(newBook);
});

//редактируем объект книги, если запись не найдено вернем Code: 404
router.put("/:id", (req, res) => {
  const { books } = lib;
  const { title, description, authors } = req.body;
  const { id } = req.params;
  const idx = books.findIndex((el) => el.id === id);
  if (idx !== -1) {
    books[idx] = {
      ...books[idx],
      title,
      description,
      authors,
    };
    res.json(books[idx]);
  } else {
    res.status(404);
    res.json({ errcode: 404, errmsg: "Запись не найдена" });
  }
});

//удаляем книгу и возвращаем ответ: 'ok'
router.delete("/:id", (req, res) => {
  const { books } = lib;
  const { id } = req.params;
  const idx = books.findIndex((el) => el.id === id);
  if (idx !== -1) {
    books.splice(idx, 1);
  } else {
    res.status(404);
    res.json({ errcode: 404, errmsg: "Запись не найдена" });
  }
});

module.exports = router;
