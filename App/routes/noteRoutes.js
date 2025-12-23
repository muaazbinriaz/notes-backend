let express = require("express");
const {
  noteInsert,
  getNotes,
  deleteNote,
  updateNote,
} = require("../controllers/notesController");

let noteRouter = express.Router();

noteRouter.post("/insert", noteInsert);
noteRouter.get("/getNotes", getNotes);
noteRouter.delete("/deleteNote/:id", deleteNote);
noteRouter.put("/updateNote/:id", updateNote);

module.exports = noteRouter;
