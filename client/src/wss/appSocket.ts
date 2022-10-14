import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Event, socket } from ".";
import { ROUTES } from "../constants/routes";
import { addFriendErr, addFriendRes } from "../state/addFriend/actions";
import { useAppDispatch, useAppSelector } from "../store";

export const useServerEvents = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    socket.on(Event.Login, () => {
      navigate(ROUTES.ROOT);
    });

    socket.on(Event.AddFriend, (res) => {
      if (res.error) {
        dispatch(addFriendErr(res.error));
      } else {
        dispatch(addFriendRes());
      }
    });

    socket.on(Event.JoinRoom, (res) => {
      console.log({ event: Event.JoinRoom, res });
    });
  }, []);

  useEffect(() => {}, []);
};

export const useAppScoket = () => {
  const authToken = useAppSelector((state) => state.user.authToken);
  function addFriend(id: number) {
    socket.emit(Event.AddFriend, { friendId: id });
  }

  function login(token: string) {
    socket.emit(Event.Login, { token });
  }

  function joinRooms(rooms: number[]) {
    socket.emit(Event.JoinRoom, { rooms });
  }

  useEffect(() => {
    if (authToken) login(authToken);
  }, [authToken]);

  return { addFriend, login, joinRooms };
};
