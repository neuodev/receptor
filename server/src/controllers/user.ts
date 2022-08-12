import { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import { validationResult } from "express-validator";
import { UniqueConstraintError } from "sequelize";
import { UserEntry, userRepo } from "../repositories/userRepo";
import ResponseError from "../utils/error";
import jwt, { Secret } from "jsonwebtoken";

// @api  POST /api/v1/user
// @desc Register new user into the database
// @access  public
export const createUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(200).json({ errors: errors.array() });
      return;
    }
    try {
      let userId = await userRepo.registerUser(req.body);
      res.status(200).json({
        userId,
      });
    } catch (error) {
      if (error instanceof UniqueConstraintError) {
        return next(new ResponseError("User already exist", 404));
      }

      throw error;
    }
  }
);

// @api  GET /api/v1/user
// @desc Login + Should return the auth token
// @access  public
export const login = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(200).json({ errors: errors.array() });
      return;
    }

    let user = await userRepo.getUser(req.body.username, req.body.password);
    if (user === null)
      return next(new ResponseError("Incorrect username or password", 400));

    let secret = process.env.JWT_SECRET;
    if (secret == undefined)
      return next(new ResponseError("Unable to gen auth token", 500));

    let token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as Secret, {
      expiresIn: "7d",
    });

    // Generate new JWT
    res.status(200).json({
      user,
      token,
    });
  }
);
