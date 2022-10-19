import { IParticipants, Participants } from "../models/Participants";
import { IRoom, Room, RoomType } from "../models/Room";
import { IUser, User } from "../models/User";
import { parseQuery } from "../utils/prase";

class RoomUOW {
  async deleteById(id: number) {
    await Room.destroy({
      where: { id },
    });
  }

  async newRoom(type: RoomType, name?: string): Promise<number> {
    const room = await Room.create({
      name,
      type,
    });
    return room.getDataValue("id");
  }

  async getById(
    id: number
  ): Promise<(IRoom & { participants: IParticipants[] }) | null> {
    const room = await Room.findOne({
      where: {
        id,
      },
      include: {
        model: Participants,
      },
    });

    return room
      ? parseQuery<IRoom & { participants: IParticipants[] }>(room.get())
      : null;
  }

  async getGroups(userId: number) {
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

    return rooms;
  }
}

const roomUOW = new RoomUOW();
export default roomUOW;
