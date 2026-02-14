import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./apiSlice";
import appReducer from "./appSlice";
import projectsReducer from "./projectsSlice";

export const store = configureStore({
  reducer: {
    app: appReducer,
    projects: projectsReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});
