import { Participants, Role } from "../models/Participants";

class ParticipantsUOW {
  async newParticipants(
    users: Array<{ id: number; role: Role }>,
    roomId: number
  ) {
    await Participants.bulkCreate(
      users.map((user) => ({
        userId: user.id,
        role: user.role,
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
