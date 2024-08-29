// userdetailsslice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  id:"",
  name: "",
  email: "",
  mobilenumber: "",
  designation: "",
  gender: "",
  courses: [],
  file: null,
  preview: "",
  image:""
};

export const userDetailsSlice = createSlice({
  name: "userDetails",
  initialState,
  reducers: {
    setUserDetails: (state, action) => {
      return { ...state, ...action.payload };
    },
    clearUserDetails: (state) => {
      return { ...initialState };
    },
  },
});

export const { setUserDetails, clearUserDetails } = userDetailsSlice.actions;
export default userDetailsSlice.reducer;
