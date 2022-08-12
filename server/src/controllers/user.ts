import { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import { validationResult } from "express-validator";
import { userRepo } from "../repositories/userRepo";

export const createUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(200).json({ errors: errors.array() });
      return;
    }
    let userId = userRepo.registerUser(req.body);
    res.status(200).json({
      userId,
    });
  }
);
