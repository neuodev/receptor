import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Event, socket } from ".";
import { ROUTES } from "../constants/routes";
import { addFriendErr, addFriendRes } from "../state/addFriend/actions";
import { useAppDispatch } from "../store";

export const useServerEvents = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    socket.on(Event.Login, (res) => {
      navigate(ROUTES.ROOT);
    });

    socket.on(Event.AddFriend, (res) => {
      if (res.error) {
        dispatch(addFriendErr(res.error));
      } else {
        dispatch(addFriendRes());
      }
    });
  }, []);
};

export const useAppScoket = () => {
  function addFriend(id: number) {
    socket.emit(Event.AddFriend, { friendId: id });
  }

  function login(token: string) {
    socket.emit(Event.Login, { token });
  }
  return { addFriend, login };
};
