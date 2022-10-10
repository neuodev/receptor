import express from "express";
import { body } from "express-validator";
import { createUser, login } from "../controllers/user";

export const userRouter = express.Router();

userRouter
  .route("/register")
  .post(
    body("username").isString(),
    body("password").isLength({ min: 6 }),
    createUser
  );

userRouter
  .route("/login")
  .get(
    body("username").isString(),
    body("password").isLength({ min: 6 }),
    login
  );
