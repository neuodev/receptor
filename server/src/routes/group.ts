import { Router } from "express";
import { createGroup, getGroups } from "../controllers/group";
import { auth } from "../middleware/auth";

const groupRouter = Router();
groupRouter.route("/").get(auth, getGroups).post(auth, createGroup);

export default groupRouter;
