import express from "express";
import { body } from "express-validator";
import { createUser, login } from "../controllers/user";

export const userRouter = express.Router();

userRouter
  .route("/user")
  .post(
    body("username").isString(),
    body("password").isLength({ min: 6 }),
    createUser
  )
  .get(
    body("username").isString(),
    body("password").isLength({ min: 6 }),
    login
  );
