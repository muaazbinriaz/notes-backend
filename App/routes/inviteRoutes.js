const express = require("express");
const ensureAuthenticated = require("../middlewares/auth");
const {
  createInvite,
  acceptInvite,
} = require("../controllers/inviteController");
const inviteRouter = express.Router();

inviteRouter.post("/createInvite", ensureAuthenticated, createInvite);
inviteRouter.post("/acceptInvite", ensureAuthenticated, acceptInvite);

module.exports = inviteRouter;
