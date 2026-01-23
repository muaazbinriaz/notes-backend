const List = require("../models/list.model");
const Note = require("../models/notes.model");

const createList = async (req, res) => {
  try {
    const { position, title, boardId } = req.body;
    if (!title || !boardId) {
      return res
        .status(400)
        .json({ success: false, message: "Title and boardId are required" });
    }
    const list = new List({
      title,
      userId: req.user._id,
      position,
      boardId,
    });
    const savedList = await list.save();
    res.status(201).json({ success: true, data: savedList });
  } catch (err) {
    console.error("Create list error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

const getLists = async (req, res) => {
  try {
    const { boardId } = req.query;
    if (!boardId) {
      return res.status(400).json({ message: "boardId is required" });
    }
    const lists = await List.find({ userId: req.user._id, boardId }).sort({
      position: 1,
    });
    res.json({ success: true, data: lists });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const deleteList = async (req, res) => {
  try {
    const { id } = req.params;
    const list = await List.findOne({ _id: id, userId: req.user._id });
    if (!list) {
      return res
        .status(404)
        .json({ success: false, message: "List not found" });
    }
    await Note.deleteMany({ listId: id, userId: req.user._id });
    await List.deleteOne({ _id: id });
    res.json({ success: true, message: "List and its notes deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const reorderList = async (req, res) => {
  try {
    const { lists } = req.body;
    if (!Array.isArray(lists)) {
      return res
        .status(400)
        .json({ success: false, message: "Lists must be an array" });
    }

    await Promise.all(
      lists.map(({ id, position }) =>
        List.updateOne(
          { _id: id, userId: req.user._id },
          { $set: { position } },
        ),
      ),
    );

    res.json({ success: true });
  } catch (err) {
    console.error("Reorder error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { createList, getLists, deleteList, reorderList };
