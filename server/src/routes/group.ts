import { Router } from "express";
import {
  createGroup,
  deleteGroup,
  getGroups,
  leaveGroup,
} from "../controllers/group";
import { auth } from "../middleware/auth";

const groupRouter = Router();
groupRouter.route("/").get(auth, getGroups).post(auth, createGroup);
groupRouter.route("/:id").delete(auth, deleteGroup);
groupRouter.route("/:id/leave").delete(auth, leaveGroup);

export default groupRouter;
