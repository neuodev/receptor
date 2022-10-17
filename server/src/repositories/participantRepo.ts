import { IParticipants, Participants } from "../models/Participants";
import { parseQuery } from "../utils/prase";
import BaseRepo from "./baseRepo";

export default class ParticipantsRepo extends BaseRepo {
  async newParticipants(ids: Array<number>, roomId: number) {
    await Participants.bulkCreate(
      ids.map((id) => ({
        userId: id,
        roomId,
      }))
    );
  }

  async getUserRoomIds(userId: number): Promise<number[]> {
    const query = await Participants.findAll({
      where: {
        userId,
      },
      attributes: ["roomId"],
    });
    const roomIds = parseQuery<Array<{ roomId: number }>>(query);
    return roomIds.map(({ roomId }) => roomId);
  }
}
