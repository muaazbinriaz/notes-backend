const Note = require("../models/notes.model");

let noteInsert = async (req, res) => {
  try {
    const { title, body } = req.body;

    const note = new Note({
      title,
      body,
      userId: req.user._id,
    });

    const savedNote = await note.save();
    res.status(201).json(savedNote);
  } catch (err) {
    res.status(500).json({ status: 0, error: err.message });
  }
};

let getNotes = async (req, res) => {
  try {
    const userNotes = await Note.find({ userId: req.user._id });
    res.json(userNotes);
  } catch (err) {
    res.status(500).json({ status: 0, error: err.message });
  }
};

let deleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedNote = await Note.findOneAndDelete({
      _id: id,
      userId: req.user._id,
    });

    if (!deletedNote) {
      return res
        .status(404)
        .json({ status: 0, message: "Note not found or not yours" });
    }

    res.json({ status: 1, message: "Note deleted successfully", deletedNote });
  } catch (err) {
    res.status(500).json({ status: 0, error: err.message });
  }
};

const updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, body } = req.body;

    const updatedNote = await Note.findOneAndUpdate(
      { _id: id, userId: req.user._id },
      { title, body, updatedAt: Date.now() },
      { new: true }
    );

    if (!updatedNote) {
      return res
        .status(404)
        .json({ status: 0, message: "Note not found or not yours" });
    }

    res.json({ status: 1, message: "Note updated", updatedNote });
  } catch (err) {
    res.status(500).json({ status: 0, error: err.message });
  }
};

module.exports = { noteInsert, getNotes, deleteNote, updateNote };
