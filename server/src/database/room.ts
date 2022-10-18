import { IParticipants, Participants } from "../models/Participants";
import { IRoom, Room, RoomType } from "../models/Room";
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
}

const roomUOW = new RoomUOW();
export default roomUOW;
