import asyncHandler from "express-async-handler";
import { Request, Response, NextFunction } from "express";
import { IParticipants, Participants } from "../models/Participants";
import { IRoom, Room, RoomType } from "../models/Room";
import { IUser, User } from "../models/User";
import { parseQuery } from "../utils/prase";

// @api  GET /api/v1/user/groups
// @desc Get user groups
// @access  Private/user
export const getGroups = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    let userId = req.user.id;
    const query = await Participants.findAll({
      where: {
        userId,
      },
      include: [
        {
          model: Room,
          where: {
            type: RoomType.Group,
          },
          include: [
            {
              model: Participants,
              attributes: {
                exclude: ["id", "userId", "roomId"],
              },
              include: [
                {
                  model: User,
                  attributes: {
                    exclude: ["password"],
                  },
                },
              ],
            },
          ],
        },
      ],
    });

    const rooms = parseQuery<
      Array<{
        id: number;
        userId: number;
        roomId: number;
        createdAt: string;
        updatedAt: string;
        room: IRoom & { participants: Array<IParticipants & { user: IUser }> };
      }>
    >(query);

    res.status(200).json(
      rooms.map(({ room }) => ({
        ...room,
        participants: room.participants.map((p) => ({
          joinedAt: p.createdAt,
          ...p.user,
        })),
      }))
    );
  }
);
