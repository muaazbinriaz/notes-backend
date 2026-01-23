const express = require("express");
const ensureAuthenticated = require("../middlewares/auth");
const { createBoard, getBoards } = require("../controllers/boardsController");
const boardRouter = express.Router();

boardRouter.post("/create", ensureAuthenticated, createBoard);
boardRouter.get("/getBoards", ensureAuthenticated, getBoards);

module.exports = boardRouter;
