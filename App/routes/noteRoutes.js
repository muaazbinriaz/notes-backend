let express = require("express");
let noteRouter = express.Router();

const {
  noteInsert,
  getNotes,
  deleteNote,
  updateNote,
} = require("../controllers/notesController");

function hello() {
  console.log("hello");
}

noteRouter.get("/", hello);
noteRouter.post("/insert", noteInsert);
noteRouter.get("/getNotes", getNotes);
noteRouter.delete("/deleteNote/:id", deleteNote);
noteRouter.put("/updateNote/:id", updateNote);

module.exports = noteRouter;
