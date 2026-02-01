const UserModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const listModel = require("../models/list.model");
const inviteModel = require("../models/invite.model");
const boardModel = require("../models/board.model");

const signup = async (req, res) => {
  try {
    const { name, email, password, inviteId } = req.body;
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists, please login",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new UserModel({
      name,
      email,
      password: hashedPassword,
    });
    await newUser.save();
    if (inviteId) {
      try {
        const invite = await inviteModel.findOne({
          inviteId,
          used: false,
        });
        if (invite) {
          if (invite.email.toLowerCase() !== email.toLowerCase()) {
            console.error("Invite email mismatch:", {
              inviteEmail: invite.email,
              signupEmail: email,
            });
          } else {
            const board = await boardModel.findById(invite.boardId);
            if (board) {
              const isAlreadyMember =
                board.ownerId.toString() === newUser._id.toString() ||
                board.members.some(
                  (m) => m.toString() === newUser._id.toString(),
                );
              if (!isAlreadyMember) {
                board.members.push(newUser._id);
                await board.save();
                invite.used = true;
                await invite.save();
                console.log("User added to board successfully:", {
                  userId: newUser._id,
                  boardId: board._id,
                });
              } else {
                console.log("User already a member, skipping");
              }
            } else {
              console.error("Board not found for invite:", invite.boardId);
            }
          }
        } else {
          console.log("Invite not found or already used:", inviteId);
        }
      } catch (inviteError) {
        console.error("Error processing invite during signup:", inviteError);
      }
    }
    const token = jwt.sign(
      { email: newUser.email, _id: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );
    res.status(201).json({
      success: true,
      message: "Signup successful",
      token,
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(403)
        .json({ success: false, message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { email: user.email, _id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const logout = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: "Logout Successful",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = { signup, login, logout };
