import { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import { userRepo } from "../repositories/userRepo";

export const createUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    let userId = userRepo.registerUser(req.body);
    res.status(200).json({
      userId,
    });
  }
);
