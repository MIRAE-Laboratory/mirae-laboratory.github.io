import React from "react";
import ReactDOM from "react-dom/client";
import "./custom.scss";
import { Provider } from "react-redux";
import { store } from "./app/store";
import { filteredProjects, projectCardImages } from "./config";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <App
      filteredProjects={filteredProjects}
      projectCardImages={projectCardImages}
    />
  </Provider>
);
