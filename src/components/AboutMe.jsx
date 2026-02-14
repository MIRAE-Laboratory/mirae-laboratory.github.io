import React from "react";
import { Element } from "react-scroll";
import { Container, Row, Col } from "react-bootstrap";
import Title from "./Title";

const AboutMe = ({ avatar_url, bio, moreInfo }) => (
  <Element name="About" id="about">
    <section className="section">
      <Container>
        <div className="d-flex justify-content-center">
          <Title size="h2" text="About" />
        </div>
        <Row className="align-items-center mt-5">
          <Col className="d-flex flex-column text-center">
            <Container>
              {bio && <p>{bio}</p>}
              {moreInfo && <p>{moreInfo}</p>}
            </Container>
          </Col>
          {avatar_url && (
            <Col className="d-none d-md-block text-center">
              <img
                src={avatar_url}
                alt="Lab"
                loading="lazy"
                className="mx-auto rounded-circle border border-primary-subtle"
                style={{ width: "15rem", height: "15rem" }}
              />
            </Col>
          )}
        </Row>
      </Container>
    </section>
  </Element>
);

export default AboutMe;
