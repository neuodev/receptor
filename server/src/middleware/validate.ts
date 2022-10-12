import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";

export const validateReq = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();
  // Return one error at a time
  let error = errors.array()[0];
  res.status(400).json({ error: error.msg });
};
