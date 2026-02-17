import React from "react";
import { Link } from "react-router-dom";
// State
import { useGetUsersQuery } from "../app/apiSlice";
// Components
import Introduction from "../components/Introduction";
import Skills from "../components/Skills";
import RepositoriesSection from "../components/RepositoriesSection";
import Contact from "../components/Contact";
import BackToTop from "../components/BackToTop";
// Utils
import { updateTitle } from "../utils";
// Config
import { siteName } from "../config";

// #region component
const Home = () => {
  const { data: userData } = useGetUsersQuery();

  React.useEffect(() => {
    updateTitle(userData?.name ? `${userData.name} | ${siteName}` : siteName);
  }, [userData]);

  return (
    <>
      <main>
        <Introduction />
        <section className="py-3 border-bottom border-top">
          <div className="container text-center">
            <p className="mb-2" style={{ color: "#495057" }}>태그·카테고리 기반 자료</p>
            <div className="d-flex flex-wrap justify-content-center gap-2">
              <Link to="/Professor" className="btn btn-outline-primary btn-sm">Professor</Link>
              <Link to="/People" className="btn btn-outline-secondary btn-sm">People</Link>
              <Link to="/Achievements" className="btn btn-outline-secondary btn-sm">Achievements</Link>
              <Link to="/Archive" className="btn btn-outline-secondary btn-sm">Archive</Link>
            </div>
          </div>
        </section>
        <Skills />
        <RepositoriesSection />
        <Contact />
      </main>
      <BackToTop />
    </>
  );
};
// #endregion

export default Home;
