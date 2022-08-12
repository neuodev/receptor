import { Request, Response, NextFunction } from "express";
import ResponseError from "../utils/error";
import { UniqueConstraintError, ValidationError } from "sequelize";
export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = 500;
  let msg = "Unexpected error.";
  if (err instanceof UniqueConstraintError) {
    msg = `Entry already exist`;
    statusCode = 404;
  } else if (err instanceof Error) {
    console.log("up");
    msg = err.message;
  } else if (err instanceof ResponseError) {
    console.log("here!");
    msg = err.message;
    statusCode = err.statusCode;
  } else if (err instanceof ValidationError) {
    console.log("hereeee!");
    msg = err.message;
    statusCode = 400;
  }

  res.status(statusCode).json({
    error: msg,
  });
};
