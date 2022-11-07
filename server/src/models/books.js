const { Schema, model } = require("mongoose");
const { v4: uuid } = require("uuid");

const booksSchema = new Schema({
  id: {
    type: String,
    default: uuid(),
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
  authors: {
    type: String,
    default: "",
  },
  favorite: {
    type: String,
    default: "",
  },
  fileCover: {
    type: String,
    default: "",
  },
  fileName: {
    type: String,
    default: "",
  },
  fileBook: {
    type: String,
    default: "",
  },
});

module.exports = model("Books", booksSchema);
