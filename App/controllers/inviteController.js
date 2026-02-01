const { v4: uuidv4 } = require("uuid");
const boardModel = require("../models/board.model");
const inviteModel = require("../models/invite.model");
const createInvite = async (req, res) => {
  try {
    const { boardId, email } = req.body;
    const inviteId = uuidv4();
    const invite = new inviteModel({
      inviteId,
      boardId,
      email,
    });
    await invite.save();
    const frontendUrl = process.env.FRONTEND_URL;
    const link = `${frontendUrl}/signup?inviteId=${inviteId}`;
    res.json({ success: true, link });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const acceptInvite = async (req, res) => {
  try {
    const { inviteId } = req.body;
    const userId = req.user._id;
    const userEmail = req.user.email;
    const invite = await inviteModel.findOne({
      inviteId,
      used: false,
    });
    if (!invite) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired invite.",
      });
    }
    if (invite.email.toLowerCase() !== userEmail.toLowerCase()) {
      return res.status(403).json({
        success: false,
        message: "Please use the account that received this invite.",
        details: {
          inviteFor: invite.email,
          yourEmail: userEmail,
        },
      });
    }
    const board = await boardModel.findById(invite.boardId);
    if (!board) {
      return res.status(404).json({
        success: false,
        message: "Board not found. It may have been deleted.",
      });
    }
    const isOwner = board.ownerId.toString() === userId.toString();
    const isMember = board.members.some(
      (memberId) => memberId.toString() === userId.toString(),
    );
    const alreadyOnBoard = isOwner || isMember;
    if (alreadyOnBoard) {
      invite.used = true;
      await invite.save();
      return res.json({
        success: true,
        message: "You are already a member of this board!",
        board: {
          id: board._id,
          title: board.title,
        },
        alreadyMember: true,
      });
    }
    board.members.push(userId);
    await board.save();
    invite.used = true;
    await invite.save();
    res.json({
      success: true,
      message: `Successfully joined "${board.title}"!`,
      board: {
        id: board._id,
        title: board.title,
      },
      alreadyMember: false,
    });
  } catch (err) {
    console.error("Accept invite error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to accept invite",
      error: err.message,
    });
  }
};

module.exports = { createInvite, acceptInvite };
