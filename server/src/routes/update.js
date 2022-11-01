const express = require("express");
const router = express.Router();
const { books } = require("../public/context/lib");
const fileMulter = require("../middleware/file");

router.get("/:id", (req, res) => {
  const { id } = req.params;
  const idx = books.findIndex((el) => el.id === id);

  res.render("update", {
    book: books[idx],
  });
});

//редактируем объект книги, если запись не найдено вернем Code: 404
router.post("/:id", (req, res) => {
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
    //res.json(books[idx]);
    res.redirect(`/view/${books[idx].id}`);
  } else {
    res.status(404);
    res.json({ errcode: 404, errmsg: "Запись не найдена" });
  }
});

//Загрузить файл
router.post("/:id/upload-file", fileMulter.single("books-file"), (req, res) => {
  const { id } = req.params;
  const idx = books.findIndex((el) => el.id === id);
  if (req.file) {
    const { path, filename } = req.file;
    if (idx !== -1) {
      books[idx].fileBook = path;
      books[idx].fileName = filename;
      res.redirect(`/update/${books[idx].id}`);
    } else {
      res.status(404);
      res.json({ errcode: 404, errmsg: "Запись не найдена" });
    }

    res.json({ path });
  }
  res.json();
});

module.exports = router;
