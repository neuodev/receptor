import { useEffect } from "react";
import { Event, socket } from ".";
import { addFriendErr, addFriendRes } from "../state/addFriend/actions";
import { useAppDispatch } from "../store";

export const useAppSocket = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    socket.on(Event.Login, (res) => {
      console.log(res);
    });

    socket.on(Event.AddFriend, (res) => {
      if (res.error) {
        dispatch(addFriendErr(res.error));
      } else {
        dispatch(addFriendRes());
      }
    });
  }, []);
  return {};
};
