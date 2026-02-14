import React from "react";
import { useGetUsersQuery } from "../app/apiSlice";
import Hero from "../components/Hero";
import AboutMe from "../components/AboutMe";
import Skills from "../components/Skills";
import Projects from "../components/Projects";
import Contact from "../components/Contact";
import BackToTop from "../components/BackToTop";
import { filteredProjects, moreInfo, siteName } from "../config";
import { updateTitle } from "../utils";

const Home = () => {
  const { data: userData } = useGetUsersQuery();

  React.useEffect(() => {
    updateTitle(userData?.name ? `${userData.name} | ${siteName}` : siteName);
  }, [userData]);

  return (
    <>
      <Hero name={userData?.name} />
      <main>
        <AboutMe avatar_url={userData?.avatar_url} bio={userData?.bio} moreInfo={moreInfo} />
        <Skills />
        <Projects filteredProjects={filteredProjects} />
        <Contact />
      </main>
      <BackToTop />
    </>
  );
};

export default Home;
