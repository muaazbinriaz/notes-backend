const express = require("express");
const noteRouter = express.Router();
const ensureAuthenticated = require("../middlewares/auth");

const {
  noteInsert,
  getNotes,
  deleteNote,
  updateNote,
  getNoteById,
  updateNoteStatus,
} = require("../controllers/notesController");

noteRouter.post("/insert", ensureAuthenticated, noteInsert);
noteRouter.get("/getNotes", ensureAuthenticated, getNotes);
noteRouter.get("/getNoteById/:id", ensureAuthenticated, getNoteById);
noteRouter.delete("/deleteNote/:id", ensureAuthenticated, deleteNote);
noteRouter.put("/updateNote/:id", ensureAuthenticated, updateNote);
noteRouter.put("/updateStatus/:id", ensureAuthenticated, updateNoteStatus);
module.exports = noteRouter;
