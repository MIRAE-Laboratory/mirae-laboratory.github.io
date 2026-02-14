import { createSlice } from "@reduxjs/toolkit";

const initialState = { mode: "light" };

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setMode: (state, action) => {
      state.mode = action.payload;
    },
  },
});

export const { setMode } = appSlice.actions;
export const selectMode = (state) => state.app.mode;
export default appSlice.reducer;
