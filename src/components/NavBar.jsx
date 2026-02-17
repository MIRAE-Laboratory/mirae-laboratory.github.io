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
    { id: "1R", name: "Professor", route: "/Professor" },
    { id: "2R", name: "People", route: "/People" },
    { id: "3R", name: "Achievements", route: "/Achievements" },
    { id: "4R", name: "Lectures", external: true, href: "https://github.com/MIRAE-Laboratory/Lectures" },
    { id: "5R", name: "Repositories", route: "/Repositories" },
    { id: "6R", name: "Archive", route: "/Archive" },
    { id: "7R", name: "Contact", route: "/Contact" },
// { id: "8R", name: "UST-KAERI School", external: true, href: "https://kaeri.ust.ac.kr/" },
  ],
  to: [
    { id: "1T", name: "Home", to: "Home" },
    { id: "2T", name: "About Me", to: "About" },
    { id: "3T", name: "Skills", to: "Skills" },
    { id: "4T", name: "Repositories", to: "Repositories" },
    { id: "5T", name: "Contact", to: "Contact" },
  ],
};
// #endregion

// #region styled-components
const StyledDiv = styled.div`
  .navbar {
    border-bottom: var(--border);
    background-color: #000000 !important;
  }

  .navbar .nav-link {
    color: #ffffff !important;
  }

  .navbar .nav-link:hover,
  .navbar .nav-link.active {
    color: #007bff !important;
  }

  .navbar-brand {
    color: #ffffff !important;
  }

  .spacer {
    height: var(--nav-height);
  }

  .logo-img {
    background: #ffffff;
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
        expand="sm"
        expanded={isExpanded}
        bg="dark"
        variant="dark"
        fixed="top"
        style={{ backgroundColor: "#000000 !important" }}
      >
        <Container>
          <Navbar.Brand as={Link} to="/">
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
                        (el.route === "/Archive" && pathname.startsWith("/Archive")) ||
                        (el.route === "/Achievements" && pathname === "/Achievements")
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
