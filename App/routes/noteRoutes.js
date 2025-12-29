const express = require("express");
const noteRouter = express.Router();
const ensureAuthenticated = require("../middlewares/auth");

const {
  noteInsert,
  getNotes,
  deleteNote,
  updateNote,
} = require("../controllers/notesController");

noteRouter.get("/", (req, res) => {
  res.send("Notes API root");
});

noteRouter.post("/insert", ensureAuthenticated, noteInsert);
noteRouter.get("/getNotes", ensureAuthenticated, getNotes);
noteRouter.delete("/deleteNote/:id", ensureAuthenticated, deleteNote);
noteRouter.put("/updateNote/:id", ensureAuthenticated, updateNote);

module.exports = noteRouter;
