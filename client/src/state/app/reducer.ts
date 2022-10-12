import { createReducer } from "@reduxjs/toolkit";
import { hideAppModal, showAppModal } from "./actions";

export enum AppModal {
  AddFriend,
}

type App = {
  modal: AppModal | null;
};

export const appReducer = createReducer<App>(
  {
    modal: null,
  },
  (builder) => {
    builder
      .addCase(showAppModal, (state, { payload }) => ({
        ...state,
        modal: payload,
      }))
      .addCase(hideAppModal, (state) => ({
        ...state,
        modal: null,
      }));
  }
);
