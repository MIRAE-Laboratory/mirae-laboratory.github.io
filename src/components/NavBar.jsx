import React from "react";
import styled from "styled-components";
// State
import { useSelector } from "react-redux";
import { selectMode } from "../app/appSlice";
import PropTypes from "prop-types";
// Router
import { Link, useLocation } from "react-router-dom";
// Images
import defaultLogo from "../images/defaultNavLogo.svg";
// Components
import { Container, Nav, Navbar } from "react-bootstrap";
import ThemeToggle from "./ThemeToggle";

// #region constants
const navLinks = {
  routes: [
    { id: "1R", name: "Home", route: "/" },
    { id: "2R", name: "Professor", route: "/Professor" },
    { id: "3R", name: "People", route: "/People" },
    { id: "4R", name: "Publications", route: "/Publications" },
    { id: "5R", name: "Lectures", external: true, href: "https://github.com/MIRAE-Laboratory/Lectures" },
    { id: "6R", name: "Repositories", route: "/Repositories" },
    { id: "7R", name: "Archive", route: "/Archive" },
    { id: "8R", name: "UST-KAERI School", external: true, href: "https://kaeri.ust.ac.kr/" },
    { id: "9R", name: "UST", external: true, href: "https://ust.ac.kr/" },
    { id: "10R", name: "Contact Us", route: "/Contact" },
  ],
  to: [
    { id: "1T", name: "Home", to: "Home" },
    { id: "2T", name: "About Me", to: "About" },
    { id: "3T", name: "Skills", to: "Skills" },
    { id: "4T", name: "Projects", to: "Projects" },
    { id: "5T", name: "Contact", to: "Contact" },
  ],
};
// #endregion

// #region styled-components
const StyledDiv = styled.div`
  .navbar {
    border-bottom: var(--border);
  }

  .spacer {
    height: var(--nav-height);
  }

  .logo-img {
    background: ${({ theme }) =>
      theme.name === "light" ? "var(--bs-dark)" : "var(--bs-light)"};
  }
`;
// #endregion

// #region component
const propTypes = {
  Logo: PropTypes.node,
  callBack: PropTypes.func,
  closeDelay: PropTypes.number.isRequired,
};
const defaultProps = {
  Logo: defaultLogo,
  closeDelay: 125,
};

const NavBar = ({ Logo, callBack, closeDelay }) => {
  const theme = useSelector(selectMode);
  const [isExpanded, setisExpanded] = React.useState(false);
  const { pathname } = useLocation();

  return (
    <StyledDiv>
      <div className="spacer" />
      <Navbar
        id="nav"
        collapseOnSelect={true}
        expand="xl"
        expanded={isExpanded}
        bg={theme === "light" ? "light" : "dark"}
        variant={theme === "light" ? "light" : "dark"}
        fixed="top"
      >
        <Container>
          <Navbar.Brand>
            <img
              alt="Logo"
              src={Logo === null ? defaultLogo : Logo}
              width="35"
              height="35"
              className={`logo-img ${typeof Logo === "string" ? "rounded-0" : "rounded-circle"}`}
            />
          </Navbar.Brand>
          <Navbar.Toggle
            aria-controls="responsive-navbar-nav"
            onClick={() => setisExpanded(!isExpanded)}
          />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav navbarScroll className="me-auto">
              {navLinks.routes.map((el) => (
                <Nav.Item key={el.id}>
                  {el.external ? (
                    <a
                      href={el.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="nav-link"
                      onClick={() => setTimeout(() => setisExpanded(false), closeDelay)}
                    >
                      {el.name}
                    </a>
                  ) : (
                    <Link
                      to={el.route}
                      className={
                        pathname === el.route ||
                        (el.route === "/Archive" && pathname.startsWith("/Archive"))
                          ? "nav-link active"
                          : "nav-link"
                      }
                      onClick={() => {
                        setTimeout(() => setisExpanded(false), closeDelay);
                      }}
                    >
                      {el.name}
                    </Link>
                  )}
                </Nav.Item>
              ))}
            </Nav>
            <Nav>
              <ThemeToggle
                closeDelay={closeDelay}
                setExpanded={setisExpanded}
                setTheme={callBack}
              />
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </StyledDiv>
  );
};

NavBar.propTypes = propTypes;
NavBar.defaultProps = defaultProps;
// #endregion

export default NavBar;
