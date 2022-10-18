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

  async deleteRoomMembers(roomId: number) {
    await Participants.destroy({
      where: {
        roomId,
      },
    });
  }

  async deleteRoomMember(userId: number, roomId: number) {
    await Participants.destroy({
      where: {
        roomId,
        userId,
      },
    });
  }
}

const participantsUOW = new ParticipantsUOW();
export default participantsUOW;
