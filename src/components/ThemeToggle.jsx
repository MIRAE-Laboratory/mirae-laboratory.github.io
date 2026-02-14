import React from "react";
import { useSelector } from "react-redux";
import { selectMode } from "../app/appSlice";

const ThemeToggle = ({ setTheme, closeDelay, setExpanded }) => {
  const theme = useSelector(selectMode);

  const toggle = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    if (setExpanded) setTimeout(() => setExpanded(false), closeDelay || 125);
  };

  return (
    <button
      type="button"
      className="nav-link border-0 bg-transparent"
      onClick={toggle}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      {theme === "light" ? "🌙" : "☀️"}
    </button>
  );
};

export default ThemeToggle;
