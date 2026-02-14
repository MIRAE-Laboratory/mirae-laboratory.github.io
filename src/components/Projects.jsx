import React from "react";
import { useSelector } from "react-redux";
import { selectMode } from "../app/appSlice";
import { selectProjects, selectMainProjects } from "../app/projectsSlice";
import { useGetProjectsQuery } from "../app/apiSlice";
import { Link } from "react-router-dom";
import { Element } from "react-scroll";
import { Button, Col, Container, Row } from "react-bootstrap";
import Loading from "./Loading";
import Title from "./Title";
import ProjectCard from "./ProjectCard";

const Projects = ({ filteredProjects }) => {
  const theme = useSelector(selectMode);
  const projects = useSelector(selectProjects);
  const mainProjects = useSelector(selectMainProjects);
  const { isLoading, isSuccess, isError, error } = useGetProjectsQuery();

  if (isLoading) return <Container className="d-flex"><Loading /></Container>;
  if (isError) return <Container><h2 className="text-center">{error?.status} – check apiSlice / config</h2></Container>;

  const display = filteredProjects?.length
    ? projects.filter((p) => filteredProjects.includes(p.name))
    : projects.slice(0, 3);
  const toShow = display.length ? display : mainProjects;

  return (
    <Element name="Projects" id="projects">
      <section className="section">
        <Container>
          <div className="d-flex justify-content-center">
            <Title size="h2" text="Projects" />
          </div>
          {isSuccess && toShow.length > 0 && (
            <>
              <Row xs={1} md={2} lg={3} className="g-4 justify-content-center">
                {toShow.map((p) => (
                  <Col key={p.id}>
                    <ProjectCard
                      image={p.image}
                      name={p.name}
                      description={p.description}
                      url={p.html_url}
                      demo={p.homepage}
                    />
                  </Col>
                ))}
              </Row>
              {projects.length > 3 && (
                <Container className="text-center mt-5">
                  <Link to="/All-Projects">
                    <Button size="lg" variant={theme === "light" ? "outline-dark" : "outline-light"}>
                      All Projects
                    </Button>
                  </Link>
                </Container>
              )}
            </>
          )}
          {isSuccess && projects.length === 0 && (
            <p className="text-center text-muted">No GitHub projects listed.</p>
          )}
        </Container>
      </section>
    </Element>
  );
};

export default Projects;
