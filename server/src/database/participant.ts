import { Participants } from "../models/Participants";

class ParticipantsUOW {
  async newParticipants(ids: Array<number>, roomId: number) {
    await Participants.bulkCreate(
      ids.map((id) => ({
        userId: id,
        roomId,
      }))
    );
  }

  async deleteByRoomId(roomId: number) {
    await Participants.destroy({
      where: {
        roomId,
      },
    });
  }
}

const participantsUOW = new ParticipantsUOW();
export default participantsUOW;
