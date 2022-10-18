import { Router } from "express";
import { createGroup, deleteGroup, getGroups } from "../controllers/group";
import { auth } from "../middleware/auth";

const groupRouter = Router();
groupRouter.route("/").get(auth, getGroups).post(auth, createGroup);
groupRouter.route("/:id").delete(auth, deleteGroup);

export default groupRouter;
