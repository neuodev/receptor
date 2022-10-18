import { Router } from "express";
import { getGroups } from "../controllers/group";
import { auth } from "../middleware/auth";

const groupRouter = Router();
groupRouter.route("/").get(auth, getGroups);

export default groupRouter;
