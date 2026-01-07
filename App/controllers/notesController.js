const Note = require("../models/notes.model");

const noteInsert = async (req, res) => {
  if (req.body.title.length > 100) {
    return res
      .status(400)
      .json({ success: false, message: "Title exceeds 100 characters" });
  }
  try {
    const { title, body } = req.body;
    const note = new Note({
      title,
      body,
      userId: req.user._id,
      status: "task",
    });
    const savedNote = await note.save();

    res
      .status(201)
      .json({ success: true, message: "Note added", data: savedNote });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.user._id });

    res.json({
      success: true,
      data: notes,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getNoteById = async (req, res) => {
  try {
    const { id } = req.params;
    const note = await Note.findOne({ _id: id, userId: req.user._id });
    if (!note) {
      return res
        .status(404)
        .json({ success: false, message: "Note not found" });
    } else {
      res.json({ success: true, data: note });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedNote = await Note.findOneAndDelete({
      _id: id,
      userId: req.user._id,
    });
    if (!deletedNote) {
      return res
        .status(404)
        .json({ success: false, message: "Note not found" });
    }
    res.json({ success: true, message: "Note deleted", data: deletedNote });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
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
        .json({ success: false, message: "Note not found" });
    }
    res.json({ success: true, message: "Note updated", data: updatedNote });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const updateNoteStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!["task", "completed"].includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid status value" });
    }
    const updatedTask = await Note.findOneAndUpdate(
      {
        _id: id,
        userId: req.user._id,
      },
      { status, updatedAt: Date.now() },
      { new: true }
    );

    if (!updatedTask) {
      return res
        .status(404)
        .json({ success: false, message: "Note not found" });
    }
    res.json({ success: true, message: "Status updated", data: updatedTask });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  noteInsert,
  getNotes,
  getNoteById,
  deleteNote,
  updateNote,
  updateNoteStatus,
};
