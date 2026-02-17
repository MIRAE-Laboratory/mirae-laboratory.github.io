// https://redux-toolkit.js.org/usage/usage-guide#simplifying-slices-with-createslice
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  repositories: [],
  mainRepositories: [],
};

export const repositoriesSlice = createSlice({
  name: "repositories",
  initialState,
  reducers: {
    setRepositories: (state, action) => {
      state.repositories = action.payload;
    },
    setMainRepositories: (state, action) => {
      state.mainRepositories = action.payload;
    },
  },
});

export const selectRepositories = (state) => state.repositories.repositories;
export const selectMainRepositories = (state) => state.repositories.mainRepositories;
export const { setRepositories, setMainRepositories } = repositoriesSlice.actions;

export default repositoriesSlice.reducer;
