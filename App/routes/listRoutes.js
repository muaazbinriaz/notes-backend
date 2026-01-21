const express = require("express");

const listRouter = express.Router();
const ensureAuthenticated = require("../middlewares/auth");
const {
  createList,
  getLists,
  deleteList,
  reorderList,
} = require("../controllers/listController");

listRouter.post("/", ensureAuthenticated, createList);
listRouter.get("/", ensureAuthenticated, getLists);
listRouter.delete("/:id", ensureAuthenticated, deleteList);
listRouter.put("/reorder", ensureAuthenticated, reorderList);

module.exports = listRouter;
