import { Room, RoomType } from "../models/Room";

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
}

const roomUOW = new RoomUOW();
export default roomUOW;
