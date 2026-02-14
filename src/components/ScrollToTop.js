import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();
  const navigate = useNavigate();

  React.useLayoutEffect(() => {
    if (hash === "") {
      setTimeout(() => window.scrollTo(0, 0), 100);
    } else {
      const id = hash.replace("#", "");
      const el = document.getElementById(id);
      if (el) el.scrollIntoView();
      else navigate("404", { replace: false });
    }
  }, [pathname, hash, navigate]);

  return null;
};

export default ScrollToTop;
