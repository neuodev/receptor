import express from "express";
import { getRoomMessages } from "../controllers/room";
import { auth } from "../middleware/auth";

export const roomRouter = express.Router();

roomRouter.route("/:id").get(auth, getRoomMessages);
