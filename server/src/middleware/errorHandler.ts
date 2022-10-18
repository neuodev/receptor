import { Request, Response, NextFunction } from "express";
import ResponseError from "../utils/error";
import { UniqueConstraintError, ValidationError } from "sequelize";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (process.env.NOD_ENV !== "production") console.log(err);

  let statusCode = 400;
  let msg = "Unexpected error, please retry";
  if (err instanceof ResponseError) {
    msg = err.message;
    statusCode = err.statusCode;
  } else if (err instanceof UniqueConstraintError) {
    statusCode = 404;
    msg = "Entry already exist";
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
