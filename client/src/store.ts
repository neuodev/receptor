import { configureStore } from "@reduxjs/toolkit";
import thunk from "redux-thunk";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { userReducer } from "./state/user/reducer";
import { appReducer } from "./state/app/reducer";
import { addFriendReducer } from "./state/addFriend/reducer";
import { save, load } from "redux-localstorage-simple";

export const store = configureStore({
  reducer: {
    user: userReducer,
    app: appReducer,
    addFriend: addFriendReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([thunk, save()]),
  preloadedState: load(),
  devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
