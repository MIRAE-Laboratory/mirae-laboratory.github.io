import { createSlice } from "@reduxjs/toolkit";

const initialState = { projects: [], mainProjects: [] };

const projectsSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    setProjects: (state, action) => {
      state.projects = action.payload;
    },
    setMainProjects: (state, action) => {
      state.mainProjects = action.payload;
    },
  },
});

export const { setProjects, setMainProjects } = projectsSlice.actions;
export const selectProjects = (state) => state.projects.projects;
export const selectMainProjects = (state) => state.projects.mainProjects;
export default projectsSlice.reducer;
