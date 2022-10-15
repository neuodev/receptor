import asyncHandler from "express-async-handler";
import { Request, Response, NextFunction } from "express";
import { Message } from "../models/Message";
import { Participants } from "../models/Participants";
import ResponseError from "../utils/error";
import { User } from "../models/User";

// @api  GET /api/v1/room/:id
// @desc Get user friends
// @access  Private/user
export const getRoomMessages = asyncHandler(
  async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    let userId = req.user.id;
    let roomId = req.params.id;

    const isMember = await Participants.findOne({ where: { userId, roomId } });

    if (isMember == null)
      return next(new ResponseError("unauthorized to access this room", 401));

    const messages = await Message.findAll({
      where: {
        roomId,
      },
      include: [
        {
          model: User,
          foreignKey: "userId",
          attributes: {
            exclude: ["password", "createdAt", "updatedAt"],
          },
        },
      ],
      attributes: {
        exclude: ["userId"],
      },
    });
    res.status(200).json(messages);
  }
);
