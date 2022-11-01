const express = require("express");
const router = express.Router();
const lib = require("../public/context/lib");
router.get("/", (req, res) => {
  const { url } = req;
  // res.json({ url });
  res.render("index", {
    lib: lib.books,
  });
});

module.exports = router;
