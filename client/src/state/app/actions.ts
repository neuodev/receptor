import { createAction } from "@reduxjs/toolkit";
import { AppModal } from "./reducer";

export const showAppModal = createAction<AppModal>("app/show-modal");
export const hideAppModal = createAction("app/hide-modal");
