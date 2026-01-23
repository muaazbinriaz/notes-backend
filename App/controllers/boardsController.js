const boardModel = require("../models/board.model");

const createBoard = async (req, res) => {
  try {
    const { title } = req.body;
    if (!title || !title.trim()) {
      return res
        .status(400)
        .json({ success: false, message: "Title is required" });
    }
    const ownerId = req.user._id;
    if (!ownerId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const board = new boardModel({
      title: title.trim(),
      ownerId,
    });
    const saveBoard = await board.save();
    return res.status(201).json({
      success: true,
      message: "Board created successfully",
      data: saveBoard,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const getBoards = async (req, res) => {
  try {
    const ownerId = req.user._id;
    if (!ownerId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const boards = await boardModel.find({ ownerId }).sort({ createdAt: -1 });
    return res.json({
      success: true,
      data: boards,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { createBoard, getBoards };
