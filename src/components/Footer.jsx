import React from "react";
import styled from "styled-components";
import SocialLinks from "./SocialLinks";

const StyledFooter = styled.footer`
  height: calc(var(--nav-height) + 1rem);
  background: var(--bs-primary);
  a {
    color: ${({ $mode }) => ($mode === "light" ? "var(--bs-light)" : "var(--bs-gray-dark)")};
    &:hover {
      color: ${({ $mode }) => ($mode === "light" ? "var(--bs-gray-dark)" : "var(--bs-light)")};
    }
  }
`;

const Footer = ({ mode = "dark" }) => (
  <StyledFooter $mode={mode} className="d-flex align-items-center justify-content-center p-2">
    <SocialLinks />
  </StyledFooter>
);

export default Footer;
