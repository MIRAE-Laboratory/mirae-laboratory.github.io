import React from "react";
import { ThemeProvider } from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { selectMode, setMode } from "./app/appSlice";
import { setProjects, setMainProjects, selectProjects } from "./app/projectsSlice";
import { useGetUsersQuery, useGetProjectsQuery } from "./app/apiSlice";
import { HashRouter, Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import AppFallback from "./components/AppFallback";
import GlobalStyles from "./components/GlobalStyles";
import ScrollToTop from "./components/ScrollToTop";
import Loading from "./components/Loading";
import { Element } from "react-scroll";
import { Container } from "react-bootstrap";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import { footerTheme, navLogo } from "./config";
import { getStoredTheme, getPreferredTheme, setTheme } from "./utils";

import Home from "./pages/Home";
import AllProjects from "./pages/AllProjects";
import People from "./pages/People";
import Publications from "./pages/Publications";
import Archive from "./pages/Archive";
import NotFound from "./pages/NotFound";

const App = ({ projectCardImages = [], filteredProjects = [] }) => {
  const theme = useSelector(selectMode);
  const projects = useSelector(selectProjects);
  const dispatch = useDispatch();
  const { isLoading, isError, error } = useGetUsersQuery();
  const { data: projectsData } = useGetProjectsQuery();

  React.useEffect(() => {
    const tempData = [];
    if (projectsData && projectsData.length > 0) {
      projectsData.forEach((el) => {
        const tempObj = {
          id: el.id,
          homepage: el.homepage,
          description: el.description,
          name: el.name,
          html_url: el.html_url,
          image: null,
        };
        if (projectCardImages && projectCardImages.length > 0) {
          const img = projectCardImages.find((i) => i.name.toLowerCase() === el.name.toLowerCase());
          if (img) tempObj.image = img.image;
        }
        tempData.push(tempObj);
      });
      dispatch(setProjects(tempData));
    }
  }, [projectsData, projectCardImages, dispatch]);

  React.useEffect(() => {
    if (projects.length > 0) {
      const toShow = filteredProjects && filteredProjects.length > 0
        ? projects.filter((p) => filteredProjects.includes(p.name))
        : projects.slice(0, 3);
      dispatch(setMainProjects(toShow.length ? toShow : projects.slice(0, 3)));
    }
  }, [projects, filteredProjects, dispatch]);

  const setThemes = React.useCallback(
    (t) => {
      if (t) {
        dispatch(setMode(t));
        setTheme(t);
      } else {
        const preferred = getPreferredTheme();
        dispatch(setMode(preferred));
        setTheme(preferred);
      }
    },
    [dispatch]
  );

  React.useEffect(() => {
    setThemes();
  }, [setThemes]);

  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
    const stored = getStoredTheme();
    if (stored !== "light" && stored !== "dark") setThemes();
  });

  if (isLoading) {
    return (
      <Container className="d-flex vh-100 align-items-center">
        <Loading />
      </Container>
    );
  }

  if (isError) {
    return (
      <Container className="d-flex vh-100 align-items-center justify-content-center">
        <h2>{error?.status === "FETCH_ERROR" ? "FETCH_ERROR - check URLs" : error?.status + " - check githubUsername in config"}</h2>
      </Container>
    );
  }

  return (
    <ErrorBoundary FallbackComponent={AppFallback}>
      <HashRouter future={{ v7_startTransition: true }}>
        <ThemeProvider theme={{ name: theme }}>
          <ScrollToTop />
          <GlobalStyles />
          <Element name="Home" id="home">
            <NavBar Logo={navLogo} callBack={setThemes} />
          </Element>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/People" element={<People />} />
            <Route path="/Publications" element={<Publications />} />
            <Route path="/Archive" element={<Archive />} />
            <Route path="/Archive/:categorySlug" element={<Archive />} />
            <Route path="/All-Projects" element={<AllProjects />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer mode={footerTheme} />
        </ThemeProvider>
      </HashRouter>
    </ErrorBoundary>
  );
};

export default App;
