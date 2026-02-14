import React from "react";
import { Link } from "react-router-dom";
// State
import { useGetUsersQuery } from "../app/apiSlice";
// Components
import Hero from "../components/Hero";
import AboutMe from "../components/AboutMe";
import Skills from "../components/Skills";
import Projects from "../components/Projects";
import Contact from "../components/Contact";
import BackToTop from "../components/BackToTop";
// Config
import { filteredProjects, moreInfo, siteName } from "../config";
// Utils
import { updateTitle } from "../utils";

// #region component
const Home = () => {
  const { data: userData } = useGetUsersQuery();

  React.useEffect(() => {
    updateTitle(userData?.name ? `${userData.name} | ${siteName}` : siteName);
  }, [userData]);

  return (
    <>
      <Hero name={userData.name} />
      <main>
        <AboutMe
          avatar_url={userData.avatar_url}
          bio={userData.bio}
          moreInfo={moreInfo}
        />
        <section className="py-3 border-bottom border-top">
          <div className="container text-center">
            <p className="text-muted mb-2">태그·카테고리 기반 자료</p>
            <div className="d-flex flex-wrap justify-content-center gap-2">
              <Link to="/Archive" className="btn btn-outline-primary btn-sm">Archive (태그/카테고리)</Link>
              <Link to="/People" className="btn btn-outline-secondary btn-sm">People</Link>
              <Link to="/Publications" className="btn btn-outline-secondary btn-sm">Publications</Link>
            </div>
          </div>
        </section>
        <Skills />
        <Projects filteredProjects={filteredProjects} />
        <Contact />
      </main>
      <BackToTop />
    </>
  );
};
// #endregion

export default Home;
