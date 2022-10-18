import express from "express";
import { getRoomMessages } from "../controllers/room";
import { auth } from "../middleware/auth";

const roomRouter = express.Router();
roomRouter.route("/:id").get(auth, getRoomMessages);

export default roomRouter;
