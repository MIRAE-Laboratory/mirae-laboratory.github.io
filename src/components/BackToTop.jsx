import React from "react";
import styled from "styled-components";
import { Icon } from "@iconify/react";
import { Link } from "react-scroll";

const StyledDiv = styled.div`
  position: fixed;
  bottom: calc(var(--min-footer-height) + 1.5rem);
  right: 1.5rem;
  visibility: hidden;
  z-index: 2;
  .link-icons {
    color: ${({ theme }) => (theme?.name === "light" ? "#45413C" : "#F5F2E8")};
  }
  &.show-up { visibility: visible; }
`;

const BackToTop = ({ home = "Home" }) => {
  const ref = React.useRef(null);

  React.useEffect(() => {
    const onScroll = () => {
      if (ref.current) ref.current.classList.toggle("show-up", window.scrollY > 500);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <StyledDiv ref={ref}>
      <Link to={home} className="link-icons" style={{ fontSize: "2.25rem" }}>
        <Icon icon="fa6-solid:circle-chevron-up" />
      </Link>
    </StyledDiv>
  );
};

export default BackToTop;
