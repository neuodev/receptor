import express from "express";
import { body } from "express-validator";
import { register, login, getUsers, getFriends } from "../controllers/user";
import { auth } from "../middleware/auth";
import { validateReq } from "../middleware/validate";

export const userRouter = express.Router();

userRouter
  .route("/register")
  .post(
    body("username").isString(),
    body("email").isEmail().withMessage("Invalid email"),
    body("password").isLength({ min: 6 }).withMessage("Invalid password"),
    validateReq,
    register
  );

userRouter
  .route("/login")
  .post(
    body("email").isEmail().withMessage("Invalid email"),
    body("password").isLength({ min: 6 }).withMessage("Invalid password"),
    validateReq,
    login
  );

userRouter.route("/").get(auth, getUsers);
userRouter.route("/friends").get(auth, getFriends);
