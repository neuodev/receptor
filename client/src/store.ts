import { configureStore } from "@reduxjs/toolkit";
import thunk from "redux-thunk";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { userReducer } from "./state/user/reducer";
import { appReducer } from "./state/app/reducer";
import { friendReducer } from "./state/friend/reducer";
import { save, load } from "redux-localstorage-simple";
import { friendsReducer } from "./state/friends/reducer";
import { messagesReducer } from "./state/messages/reducer";
import { usersReducer } from "./state/users/reducer";
import { gorupsReducer } from "./state/groups/reducer";

const savedStates = ["user"];
const namespace = "app_state";

export const store = configureStore({
  reducer: {
    user: userReducer,
    users: usersReducer,
    app: appReducer,
    friend: friendReducer,
    friends: friendsReducer,
    messages: messagesReducer,
    groups: gorupsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      thunk,
      save({ states: savedStates, namespace }),
    ]),
  preloadedState: load({ states: savedStates, namespace }),
  devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
