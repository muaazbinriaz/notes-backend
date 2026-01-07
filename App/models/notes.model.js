let mongoose = require("mongoose");

let noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  status: {
    type: String,
    enum: ["task", "completed"],
    default: "task",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

let notes = mongoose.model("notes", noteSchema);
module.exports = notes;
