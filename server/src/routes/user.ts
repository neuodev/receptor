import express from "express";
import { body } from "express-validator";
import { createUser, login } from "../controllers/user";
import { validateReq } from "../middleware/validate";

export const userRouter = express.Router();

userRouter
  .route("/register")
  .post(
    body("username").isString(),
    body("email").isEmail().withMessage("Invalid message"),
    body("password").isLength({ min: 6 }).withMessage("Invalid password"),
    validateReq,
    createUser
  );

userRouter
  .route("/login")
  .post(
    body("email").isEmail().withMessage("Invalid message"),
    body("password").isLength({ min: 6 }).withMessage("Invalid password"),
    validateReq,
    login
  );
