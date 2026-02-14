import React from "react";
import { useSelector } from "react-redux";
import { selectProjects } from "../app/projectsSlice";
import { useGetUsersQuery, useGetProjectsQuery } from "../app/apiSlice";
import { Col, Container, Row } from "react-bootstrap";
import Loading from "../components/Loading";
import Title from "../components/Title";
import ProjectCard from "../components/ProjectCard";
import BackToTop from "../components/BackToTop";
import { updateTitle } from "../utils";
import { siteName } from "../config";

const AllProjects = () => {
  const data = useSelector(selectProjects);
  const { data: userData } = useGetUsersQuery();
  const { isLoading, isError, error } = useGetProjectsQuery();

  React.useEffect(() => {
    updateTitle(userData?.name ? userData.name + " | All Projects" : "All Projects | " + siteName);
  }, [userData]);

  if (isLoading) {
    return (
      <main>
        <Container className="d-flex justify-content-center">
          <Title size="h2" text="All Projects" />
        </Container>
        <Loading />
      </main>
    );
  }

  if (isError) {
    return (
      <Container>
        <h2>{error?.status} - check apiSlice</h2>
      </Container>
    );
  }

  return (
    <main>
      <section className="section">
        <Container>
          <div className="d-flex justify-content-center">
            <Title size="h2" text="All Projects" />
          </div>
          <Row xs={1} md={2} lg={3} className="g-4 justify-content-center mt-4">
            {data.map((p) => (
              <Col key={p.id}>
                <ProjectCard name={p.name} description={p.description} url={p.html_url} demo={p.homepage} image={p.image} />
              </Col>
            ))}
          </Row>
          {data.length === 0 && <p className="text-center text-muted">No projects.</p>}
        </Container>
      </section>
      <BackToTop home="Home" />
    </main>
  );
};

export default AllProjects;
