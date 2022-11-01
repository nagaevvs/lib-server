const express = require("express");
const router = express.Router();
const lib = require("../public/context/lib");
const { books } = lib;
const http = require("http");

function getCurrentCount(id, resp, idx) {
  const url = `http://counter:3002/counter/${id}`;
  http
    .get(url, (res) => {
      const { statusCode } = res;
      if (statusCode !== 200) {
        console.log(statusCode);
        return;
      }
      res.setEncoding("utf8");
      let rowData = "";
      res.on("data", (chunk) => (rowData += chunk));
      res.on("end", () => {
        const parseData = JSON.parse(rowData);

        resp.render("view", {
          el: books[idx],
          count: parseData,
        });
      });
    })
    .on("error", (err) => {
      console.error(err);
    });
}

function postIncrCount(id) {
  const url = `http://counter:3002/counter/${id}/incr`;
  http
    .get(url, (res) => {
      const { statusCode } = res;
      if (statusCode !== 200) {
        console.log(statusCode);
        return;
      }
      res.setEncoding("utf8");
      let rowData = "";
      res.on("data", (chunk) => (rowData += chunk));
      res.on("end", () => {
        const parseData = JSON.parse(rowData);
      });
    })
    .on("error", (err) => {
      console.error(err);
    });
}

router.get("/:id", (req, res) => {
  const { id } = req.params;
  const idx = books.findIndex((el) => el.id === id);
  postIncrCount(id);
  getCurrentCount(id, res, idx);
});

//удаляем книгу и возвращаем ответ: 'ok'
router.get("/:id/delete", (req, res) => {
  const { id } = req.params;
  const idx = books.findIndex((el) => el.id === id);
  if (idx !== -1) {
    books.splice(idx, 1);
    res.redirect(`/`);
  } else {
    res.status(404);
    res.json({ errcode: 404, errmsg: "Запись не найдена" });
  }
});

module.exports = router;
