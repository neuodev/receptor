import asyncHandler from "express-async-handler";
import { Request, Response, NextFunction } from "express";
import { IParticipants, Participants } from "../models/Participants";
import { IRoom, Room, RoomType } from "../models/Room";
import { IUser, User } from "../models/User";
import { parseQuery } from "../utils/prase";
import ResponseError from "../utils/error";
import friendUOW from "../database/friend";
import roomUOW from "../database/room";
import participantsUOW from "../database/participant";

// @api  GET /api/v1/group
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

// @api  POST /api/v1/group
// @desc Create new group
// @access  Private/user
export const createGroup = asyncHandler(
  async (
    req: Request<{}, {}, { groupName: string; userIds: number[] }>,
    res: Response,
    next: NextFunction
  ) => {
    const userId = req.user.id;
    const { userIds, groupName } = req.body;

    let err: string | null = null;
    if (!groupName) err = "Group name is required";
    else if (!userIds || userIds.length === 0)
      err = "Can't create an empty group. At least one member is required";

    if (err) {
      next(new ResponseError(err, 400));
      return;
    }

    let friends = await friendUOW.getFriends(userId);
    const friendIds = new Set(
      friends
        .map((f) => [f.friendId, f.userId])
        .reduce((acc, curr) => acc.concat(curr), [])
    );

    userIds.forEach((id) => {
      if (!friendIds.has(id))
        throw new Error(`User with id of '${id}' is not a friend`);
    });

    const roomId = await roomUOW.newRoom(RoomType.Group, groupName);
    await participantsUOW.newParticipants([...friendIds, userId], roomId);
    res.status(200).json({
      roomId,
    });
  }
);
