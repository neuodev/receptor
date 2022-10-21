import { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import { validationResult } from "express-validator";
import { Op } from "sequelize";
import ResponseError from "../utils/error";
import jwt, { Secret } from "jsonwebtoken";
import { IUser, User } from "../models/User";
import { Participants } from "../models/Participants";
import { Friend, FriendshipStatus, UsersRelation } from "../models/Friend";
import { parseQuery } from "../utils/prase";
import { getUserRelation } from "../utils/user";
import { Room, RoomType } from "../models/Room";

// @api  POST /api/v1/user/register
// @desc Register new user
// @access  public
export const register = asyncHandler(
  async (
    req: Request<{}, {}, { username: string; password: string; email: string }>,
    res: Response,
    next: NextFunction
  ) => {
    const { username, email, password } = req.body;
    const isExist = await User.findOne({ where: { email } });
    if (!isExist) {
      let result = await User.create({
        username,
        email,
        password,
      });
      res.status(200).json({
        userId: result.getDataValue("id"),
      });
    } else {
      next(new ResponseError("User already exist", 400));
    }
  }
);

// @api  POST /api/v1/user/login
// @desc Login and return the auth token
// @access  public
export const login = asyncHandler(
  async (
    req: Request<{}, {}, { email: string; password: string }>,
    res: Response,
    next: NextFunction
  ) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ error: errors.array() });
      return;
    }
    const { email, password } = req.body;
    let user = await User.findOne({
      where: {
        email,
        password,
      },
      attributes: {
        exclude: ["password"],
      },
    });
    if (!user)
      return next(new ResponseError("Incorrect email or password", 400));

    const userInfo = user.get();
    let secret = process.env.JWT_SECRET;
    if (secret == undefined)
      return next(new ResponseError("Missing `JWT_SECRET` env. variable", 500));

    let token = jwt.sign(
      { id: userInfo.id },
      process.env.JWT_SECRET as Secret,
      {
        expiresIn: "7d",
      }
    );

    res.status(200).json({
      user,
      token,
    });
  }
);

// @api  GET /api/v1/user
// @desc Get all users
// @access  Private/user
export const getUsers = asyncHandler(
  async (
    req: Request<{}, {}, {}, { q?: string; limit?: number; page?: number }>,
    res: Response,
    next: NextFunction
  ) => {
    let keyword = `%${req.query.q || ""}%`;
    const limit = req.query.limit || 10;
    const page = req.query.page || 1;
    const skip = (page - 1) * limit;
    const userId = req.user.id;

    const [users, count, friends] = await Promise.all([
      User.findAll({
        where: {
          [Op.or]: {
            username: {
              [Op.iLike]: keyword,
            },
            email: {
              [Op.iLike]: keyword,
            },
          },
        },
        attributes: {
          exclude: ["password"],
        },
        offset: skip,
        limit,
      }),
      User.count(),
      Friend.findAll({
        where: {
          [Op.or]: {
            userId,
            friendId: userId,
          },
        },
        attributes: ["friendId", "userId", "status"],
      }),
    ]);

    const friendsMap = new Map<number, UsersRelation>();
    const friendsList =
      parseQuery<
        Array<{ userId: number; friendId: number; status: FriendshipStatus }>
      >(friends);

    friendsList.forEach((f) => {
      const relation = getUserRelation(f, userId);
      friendsMap.set(f.userId, relation);
      friendsMap.set(f.friendId, relation);
    });

    const usersList = parseQuery<IUser[]>(users);
    await res.status(200).json({
      users: usersList
        .filter((user) => user.id !== userId)
        .map((user) => ({
          ...user,
          relation: friendsMap.get(user.id) || UsersRelation.NotFriends,
        })),
      count,
    });
  }
);

// @api  GET /api/v1/user/friends
// @desc Get user friends
// @access  Private/user
export const getFriends = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    let userId = req.user.id;
    const rooms = await Participants.findAll({
      where: {
        userId,
      },
      include: {
        model: Room,
        where: {
          type: RoomType.DM,
        },
      },
      attributes: ["roomId"],
    });
    const roomIds = rooms.map((room) => room.getDataValue("roomId"));

    if (roomIds.length === 0) {
      res.status(200).json([]);
      return;
    }

    const friends = await Participants.findAll({
      where: {
        roomId: {
          [Op.or]: roomIds,
        },
        userId: {
          [Op.not]: userId,
        },
      },
      attributes: ["roomId"],
      include: [
        {
          model: User,
          foreignKey: "userId",
          attributes: {
            exclude: ["password"],
          },
        },
      ],
    });

    const entries = parseQuery<Array<{ roomId: number; user: IUser }>>(friends);
    res
      .status(200)
      .json(entries.map(({ roomId, user }) => ({ roomId, ...user })));
  }
);
