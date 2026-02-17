import React from "react";
// Styles
import { ThemeProvider } from "styled-components";
// State
import { useDispatch, useSelector } from "react-redux";
import { selectMode, setMode } from "./app/appSlice";
import {
  setRepositories,
  setMainRepositories,
  selectRepositories,
} from "./app/repositoriesSlice";
import { useGetUsersQuery, useGetRepositoriesQuery } from "./app/apiSlice";
// Router
import { BrowserRouter, Routes, Route } from "react-router-dom";
// Pages
import Home from "./pages/Home";
import Repositories from "./pages/Repositories";
import Professor from "./pages/Professor";
import People from "./pages/People";
import Achievements from "./pages/Achievements";
import Archive from "./pages/Archive";
import ArchiveDetail from "./pages/ArchiveDetail";
import ContactPage from "./pages/Contact";
import Tools from "./pages/Tools";
import NotFound from "./pages/NotFound";
// Components
import { ErrorBoundary } from "react-error-boundary";
import AppFallback from "./components/AppFallback";
import GlobalStyles from "./components/GlobalStyles";
import ScrollToTop from "./components/ScrollToTop";
import Loading from "./components/Loading";
import { Element } from "react-scroll";
import { Container } from "react-bootstrap";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
// Config
import { footerTheme, navLogo, filteredRepositories, repositoryCardImages } from "./config";
// Util
import { getStoredTheme, getPreferredTheme, setTheme } from "./utils";

// #region component
const App = () => {
  const theme = useSelector(selectMode);
  const repositories = useSelector(selectRepositories);
  const dispatch = useDispatch();
  const { isLoading, isSuccess, isError, error } = useGetUsersQuery();
  const { data: repositoriesData } = useGetRepositoriesQuery();
  let content;

  // Set all repositories state
  React.useEffect(() => {
    if (!repositoriesData || repositoriesData.length === 0) return;

    const tempData = repositoriesData.map(({ id, homepage, description, name, html_url }) => ({
      id,
      homepage,
      description,
      image: null,
      name,
      html_url,
    }));

    // Apply custom images if provided
    if (repositoryCardImages?.length > 0) {
      repositoryCardImages.forEach(({ name, image }) => {
        const repository = tempData.find(
          (r) => r.name.toLowerCase() === name.toLowerCase()
        );
        if (repository) repository.image = image;
      });
    }

    dispatch(setRepositories(tempData));
  }, [repositoriesData, dispatch]);

  // Set main repositories state
  React.useEffect(() => {
    if (repositories.length === 0) return;

    const mainRepositories =
      filteredRepositories?.length > 0
        ? repositories.filter((r) => filteredRepositories.includes(r.name))
        : repositories.slice(0, 3);

    dispatch(setMainRepositories(mainRepositories));
  }, [repositories, dispatch]);

  // Theme
  const setThemes = React.useCallback(
    (newTheme) => {
      const themeToSet = newTheme || getPreferredTheme();
      dispatch(setMode(themeToSet));
      setTheme(themeToSet);
    },
    [dispatch]
  );

  React.useEffect(() => {
    setThemes();

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      const storedTheme = getStoredTheme();
      if (storedTheme !== "light" && storedTheme !== "dark") {
        setThemes();
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [setThemes]);

  if (isLoading) {
    content = (
      <Container className="d-flex vh-100 align-items-center">
        <Loading />
      </Container>
    );
  } else if (isSuccess) {
    content = (
      <>
        <Element name={"Home"} id="home">
          <NavBar Logo={navLogo} callBack={(t) => setThemes(t)} />
        </Element>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/Professor" element={<Professor />} />
          <Route path="/People" element={<People />} />
          <Route path="/Achievements" element={<Achievements />} />
          <Route path="/Archive" element={<Archive />} />
          <Route path="/Archive/item/:slug" element={<ArchiveDetail />} />
          <Route path="/Archive/:categorySlug" element={<Archive />} />
          <Route path="/Repositories" element={<Repositories />} />
          <Route path="/Contact" element={<ContactPage />} />
          <Route path="/Tools" element={<Tools />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer mode={footerTheme} />
      </>
    );
  } else if (isError) {
    content = (
      <Container className="d-flex vh-100 align-items-center justify-content-center">
        <h2>
          {error.status !== "FETCH_ERROR"
            ? `${error.status}: ${error.data.message} - check githubUsername in src/config.js`
            : `${error.status} - check URLs in src/app/apiSlice.js`}
        </h2>
      </Container>
    );
  }

  return (
    <ErrorBoundary FallbackComponent={AppFallback}>
      <BrowserRouter future={{ v7_startTransition: true }}>
        <ThemeProvider theme={{ name: theme }}>
          <ScrollToTop />
          <GlobalStyles />
          {content}
        </ThemeProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
};
// #endregion

export default App;
