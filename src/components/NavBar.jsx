import React from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { selectMode } from "../app/appSlice";
import { Link, useLocation } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";
import { Container, Nav, Navbar } from "react-bootstrap";
import ThemeToggle from "./ThemeToggle";

const navLinks = {
  routes: [
    { id: "1R", name: "Home", route: "/" },
    { id: "2R", name: "People", route: "/People" },
    { id: "3R", name: "Publications", route: "/Publications" },
    { id: "4R", name: "Archive", route: "/Archive" },
    { id: "5R", name: "All Projects", route: "/All-Projects" },
  ],
  to: [
    { id: "1T", name: "Home", to: "Home" },
    { id: "2T", name: "About", to: "About" },
    { id: "3T", name: "Skills", to: "Skills" },
    { id: "4T", name: "Projects", to: "Projects" },
    { id: "5T", name: "Contact", to: "Contact" },
  ],
};

const StyledDiv = styled.div`
  .navbar { border-bottom: var(--border); }
  .spacer { height: var(--nav-height); }
  .logo-img {
    background: ${({ theme }) => (theme?.name === "light" ? "var(--bs-dark)" : "var(--bs-light)")};
  }
`;

const NavBar = ({ Logo, callBack, closeDelay = 125 }) => {
  const theme = useSelector(selectMode);
  const [isExpanded, setisExpanded] = React.useState(false);
  const { pathname } = useLocation();

  const defaultLogo = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='45' fill='%2361dbfb'/%3E%3C/svg%3E";

  return (
    <StyledDiv>
      <div className="spacer" />
      <Navbar
        collapseOnSelect
        expand="xl"
        expanded={isExpanded}
        bg={theme === "light" ? "light" : "dark"}
        variant={theme === "light" ? "light" : "dark"}
        fixed="top"
      >
        <Container>
          <Navbar.Brand>
            <img alt="Logo" src={Logo || defaultLogo} width="35" height="35" className="rounded-circle logo-img" />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" onClick={() => setisExpanded(!isExpanded)} />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
              {pathname === "/"
                ? navLinks.to.map((el) => (
                    <Nav.Item key={el.id}>
                      <ScrollLink
                        to={el.to}
                        spy
                        activeClass="active"
                        className="nav-link"
                        onClick={() => setTimeout(() => setisExpanded(false), closeDelay)}
                      >
                        {el.name}
                      </ScrollLink>
                    </Nav.Item>
                  ))
                : navLinks.routes.map((el) => (
                    <Nav.Item key={el.id}>
                      <Link
                        to={el.route}
                        className={
                          pathname === el.route || (el.route === "/Archive" && pathname.startsWith("/Archive"))
                            ? "nav-link active"
                            : "nav-link"
                        }
                        onClick={() => setTimeout(() => setisExpanded(false), closeDelay)}
                      >
                        {el.name}
                      </Link>
                    </Nav.Item>
                  ))}
            </Nav>
            <Nav>
              <ThemeToggle setTheme={callBack} closeDelay={closeDelay} setExpanded={setisExpanded} />
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </StyledDiv>
  );
};

export default NavBar;
