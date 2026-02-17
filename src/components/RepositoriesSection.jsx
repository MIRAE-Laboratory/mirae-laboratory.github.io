import React from "react";
// State
import { useSelector } from "react-redux";
import { selectMode } from "../app/appSlice";
import { selectRepositories, selectMainRepositories } from "../app/repositoriesSlice";
// Router
import { Link } from "react-router-dom";
// Icons
import { Icon } from "@iconify/react";
// Components
import { Element } from "react-scroll";
import { Button, Col, Container, Row } from "react-bootstrap";
import Title from "./Title";
import RepositoryCard from "./RepositoryCard";

// #region component
const RepositoriesSection = () => {
  const theme = useSelector(selectMode);
  const repositories = useSelector(selectRepositories);
  const mainRepositories = useSelector(selectMainRepositories);

  // Show loading state only when repositories haven't loaded yet
  if (repositories.length === 0) {
    return null;
  }

  return (
    <Element name={"Repositories"} id="repositories">
      <section className="section">
        <Container>
          <Container className="d-flex justify-content-center">
            <Title size={"h2"} text={"Repositories"} />
          </Container>
          {mainRepositories.length > 0 && (
            <>
              <Row xs={1} md={2} lg={3} className="g-4 justify-content-center">
                {mainRepositories.map((repository) => (
                  <Col key={repository.id}>
                    <RepositoryCard
                      image={repository.image}
                      name={repository.name}
                      description={repository.description}
                      url={repository.html_url}
                      demo={repository.homepage}
                    />
                  </Col>
                ))}
              </Row>
              {repositories.length > 3 && (
                <Container className="text-center mt-5">
                  <Link to="/Repositories">
                    <Button
                      size="lg"
                      variant={theme === "light" ? "outline-dark" : "outline-light"}
                    >
                      View All <Icon icon="icomoon-free:github" />
                    </Button>
                  </Link>
                </Container>
              )}
            </>
          )}
        </Container>
      </section>
    </Element>
  );
};
// #endregion

export default RepositoriesSection;
