import React from "react";
// Styles
import styled from "styled-components";
// State
import { useSelector } from "react-redux";
import { selectRepositories } from "../app/repositoriesSlice";
import { useGetUsersQuery } from "../app/apiSlice";
// Icons
import { Icon } from "@iconify/react/dist/iconify.js";
// Components
import {
  Col,
  Container,
  FormControl,
  InputGroup,
  Pagination,
  Row,
} from "react-bootstrap";
import Loading from "../components/Loading";
import Title from "../components/Title";
import RepositoryCard from "../components/RepositoryCard";
import BackToTop from "../components/BackToTop";
// Config
import { siteName } from "../config";
// Utils
import { updateTitle } from "../utils";

// #region styled-components
const StyledSection = styled.section`
  .input-group {
    max-width: 90vw;
  }

  @media screen and (min-width: 800px) {
    .input-group {
      width: 75%;
    }
  }
`;
// #endregion

// #region component
const Repositories = () => {
  const [searchInput, setSearchInput] = React.useState("");
  const [filteredResults, setFilteredResults] = React.useState([]);
  const [pageItems, setPageItems] = React.useState([]);
  const [activePage, setActivePage] = React.useState(1);
  const data = useSelector(selectRepositories);
  const { data: userData } = useGetUsersQuery();

  React.useEffect(() => {
    updateTitle(userData?.name ? `${userData.name} | Repositories` : `Repositories | ${siteName}`);
  }, [userData]);

  React.useEffect(() => {
    if (searchInput !== "") {
      const filteredData = data.filter((item) => {
        return item.name.toLowerCase().includes(searchInput.toLowerCase());
      });
      const tempPageItems = [];
      for (
        let number = 1;
        number <= Math.ceil(filteredData.length / 6);
        number++
      ) {
        tempPageItems.push(
          <Pagination.Item
            key={number}
            active={number === activePage}
            onClick={() => setActivePage(number)}
          >
            {number}
          </Pagination.Item>
        );
        setPageItems([...tempPageItems]);
      }
      if (activePage === 1) {
        setFilteredResults(filteredData.slice(0, 6));
      } else {
        setFilteredResults(
          filteredData.slice((activePage - 1) * 6, (activePage - 1) * 6 + 6)
        );
      }
    } else {
      const tempPageItems = [];
      for (let number = 1; number <= Math.ceil(data.length / 6); number++) {
        tempPageItems.push(
          <Pagination.Item
            key={number}
            active={number === activePage}
            onClick={() => setActivePage(number)}
          >
            {number}
          </Pagination.Item>
        );
        setPageItems([...tempPageItems]);
      }
      if (activePage === 1) {
        setFilteredResults(data.slice(0, 6));
      } else {
        setFilteredResults(
          data.slice((activePage - 1) * 6, (activePage - 1) * 6 + 6)
        );
      }
    }
  }, [searchInput, data, pageItems.length, activePage]);

  React.useEffect(() => {
    setActivePage(1);
  }, [searchInput]);

  if (data.length === 0) {
    return (
      <main>
        <StyledSection className="py-4">
          <Container className="d-flex justify-content-center">
            <Title size="h1" text="Repositories" />
          </Container>
          <Container className="d-flex flex-column align-items-center">
            <Loading />
          </Container>
        </StyledSection>
      </main>
    );
  }

  return (
    <>
      <main>
        <StyledSection className="py-4">
          <Container className="d-flex justify-content-center mb-4">
            <Title size="h1" text="Repositories" />
          </Container>
          <Container>
            <InputGroup className="mx-auto mb-3">
              <InputGroup.Text id="search">
                <Icon icon="ic:round-search" />
              </InputGroup.Text>
              <FormControl
                placeholder="Repository name"
                aria-label="Search repositories"
                aria-describedby="search"
                onChange={(e) => setSearchInput(e.currentTarget.value)}
              />
            </InputGroup>
            <Row xs={1} md={2} lg={3} className="g-4 justify-content-center row">
              {filteredResults.map((repository) => (
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
            <Container className="d-flex justify-content-center mt-5">
              {pageItems.length <= 2 ? (
                <Pagination size="lg">{pageItems}</Pagination>
              ) : (
                <Pagination>
                  <Pagination.Prev
                    onClick={() =>
                      activePage === 1
                        ? setActivePage(pageItems.length)
                        : setActivePage(activePage - 1)
                    }
                  />
                  {pageItems[0]}
                  <Pagination.Ellipsis />
                  <Pagination.Item active={true}>{activePage}</Pagination.Item>
                  <Pagination.Ellipsis />
                  {pageItems[pageItems.length - 1]}
                  <Pagination.Next
                    onClick={() =>
                      activePage === pageItems.length
                        ? setActivePage(1)
                        : setActivePage(activePage + 1)
                    }
                  />
                </Pagination>
              )}
            </Container>
          </Container>
        </StyledSection>
      </main>
      <BackToTop home={"Home"} />
    </>
  );
};
// #endregion

export default Repositories;
