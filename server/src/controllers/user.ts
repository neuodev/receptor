import { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import { validationResult } from "express-validator";
import { UniqueConstraintError } from "sequelize";
import { userRepo } from "../repositories/userRepo";
import ResponseError from "../utils/error";

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
