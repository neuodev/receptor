import { Socket } from "socket.io";
import BaseRepo from "./baseRepo";
import FriendRepo from "./friendRepo";
import NotificationRepo from "./notfiRepo";
import ParticipantsRepo from "./participantRepo";
import RoomRepo from "./roomRepo";
import UserRepo from "./userRepo";

// UOW stands for Unite of work
// Represent the app context
export default class AppUOW {
  baseRepo: BaseRepo;
  userRepo: UserRepo;
  friendRepo: FriendRepo;
  roomRepo: RoomRepo;
  participants: ParticipantsRepo;
  notificationRepo: NotificationRepo;

  socket: Socket;
  private authToken: string | null;

  constructor(socket: Socket) {
    this.socket = socket;
    this.authToken = null;
    this.baseRepo = new BaseRepo(this);
    this.userRepo = new UserRepo(this);
    this.friendRepo = new FriendRepo(this);
    this.roomRepo = new RoomRepo(this);
    this.notificationRepo = new NotificationRepo(this);
    this.participants = new ParticipantsRepo(this);
  }

  public async setAuthToken(token: string) {
    this.authToken = token;
  }

  public getAuthToken(): string | null {
    return this.authToken;
  }

  /**
   * Validate the auth token and return the encoded data (userId)
   */
  public decodeAuthToken(): number {
    if (this.authToken === null) throw new Error("Missing auth token");
    return this.baseRepo.decodeAuthToken(this.authToken);
  }
}
