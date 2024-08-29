// store.js
import { configureStore } from "@reduxjs/toolkit";
import userSliceReducer from "./userslice";
import userDetailsSliceReducer from "./userdetailsslice";

export const store = configureStore({
  reducer: {
    users: userSliceReducer,
    userDetails: userDetailsSliceReducer,
  },
});
