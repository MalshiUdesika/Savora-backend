import express from "express";
import { deleteModel } from "mongoose";
import { createItem, deleteItem, getItemById, searchItems, updateItem } from "../controll/itemController.js";

const itemRouter = express.Router();
itemRouter.post("/", createItem);
itemRouter.get("/", getItems);
itemRouter.get("/search/:query", searchItems);
itemRouter.delete("/:itemId", deleteItem);
itemRouter.put("/:itemId", updateItem);
itemRouter.get("/:itemId", getItemById);

export default itemRouter;