import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { IUser, User } from "../models/User";

declare global {
  namespace Express {
    interface Request {
      user: IUser;
    }
  }
}

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  let authHeader = req.headers.authorization!;
  let err: string | null = null;

  try {
    if (!authHeader) err = "Missing auth token";
    else if (!authHeader.startsWith("Bearer")) err = "Invalid auth header";

    if (err !== null) return res.status(400).json({ error: err });

    let token = authHeader.split(" ")[1] || "";
    let secret = process.env.JWT_SECRET!;
    let result = jwt.verify(token, secret) as { id: number };

    let user = await User.findOne({
      where: {
        id: result.id,
      },
    });

    if (!user) throw new Error("User not longer exist");
    req.user = user.get();
    next();
  } catch (error) {
    let err = error as Error;
    res.status(401).json({ error: err.message });
  }
};
