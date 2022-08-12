import { Request, Response, NextFunction } from "express";
import ResponseError from "../utils/error";
import { UniqueConstraintError, ValidationError } from "sequelize";
export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(err);
  let statusCode = 500;
  let msg = "Unexpected error.";
  if (err instanceof ResponseError) {
    msg = err.message;
    statusCode = err.statusCode;
  } else if (err instanceof UniqueConstraintError) {
    statusCode = 404;
  } else if (err instanceof Error) {
    msg = err.message;
  } else if (err instanceof ValidationError) {
    msg = err.message;
    statusCode = 400;
  }

  res.status(statusCode).json({
    error: msg,
  });
};
