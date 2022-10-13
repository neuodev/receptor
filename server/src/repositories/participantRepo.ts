import { Participants } from "../models/Participants";
import { IUser } from "../models/User";
import BaseRepo from "./baseRepo";

export default class ParticipantsRepo extends BaseRepo {
  async newParticipants(ids: Array<number | IUser>, roomId: number) {
    await Participants.bulkCreate(
      ids.map((id) => ({
        userId: id,
        roomId,
      }))
    );
  }
}
