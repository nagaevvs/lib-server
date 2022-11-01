const express = require("express");
const router = express.Router();

const auth = { id: 1, mail: "test@mail.ru" };

//метод всегда возвращает Code: 201 и статичный объект: { id: 1, mail: "test@mail.ru" }
router.post("/login", (req, res) => {
  res.status(201);
  res.json(auth);
});

module.exports = router;
