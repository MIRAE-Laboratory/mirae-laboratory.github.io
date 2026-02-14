import React from "react";
import styled from "styled-components";
import { Icon } from "@iconify/react";

const StyledButton = styled.button`
  position: fixed;
  bottom: calc(var(--min-footer-height) + 1.5rem);
  right: 1.5rem;
  visibility: hidden;
  z-index: 2;
  border: none;
  background: transparent;
  padding: 0;
  cursor: pointer;
  .link-icons {
    font-size: 2.25rem;
    color: ${({ theme }) => (theme?.name === "light" ? "#45413C" : "#F5F2E8")};
  }
  &:hover .link-icons { color: var(--bs-primary); }
  &.show-up { visibility: visible; }
`;

const ScrollToTopButton = () => {
  const el = React.useRef(null);
  React.useEffect(() => {
    const onScroll = () => {
      if (el.current) {
        if (window.scrollY > 400) el.current.classList.add("show-up");
        else el.current.classList.remove("show-up");
      }
    };
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <StyledButton ref={el} type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="Scroll to top">
      <span className="link-icons"><Icon icon="fa6-solid:circle-chevron-up" /></span>
    </StyledButton>
  );
};

export default ScrollToTopButton;
