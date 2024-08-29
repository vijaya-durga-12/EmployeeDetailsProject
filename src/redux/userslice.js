import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  id: "",
  username: "",
  password: "",
};

export const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    loginRedux: (state, action) => {
      console.log(action);
      const user = action.payload[0]; // Assuming the payload is an array with one user object
      state.id = user.id;
      state.username = user.username;
      state.password = user.password;
      console.log(state.username);
    },
    logoutRedux: (state) => {
      state.id = "";
      state.username = "";
      state.password = "";
    },
  },
});

export const { loginRedux, logoutRedux } = userSlice.actions;
export default userSlice.reducer;
