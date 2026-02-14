import React from "react";
import { Element } from "react-scroll";
import { Container, Row, Col } from "react-bootstrap";
import Title from "./Title";
import { skillData } from "../config";

const Skills = () => (
  <Element name="Skills" id="skills">
    <section className="section">
      <Container>
        <div className="d-flex justify-content-center">
          <Title size="h2" text="Skills" />
        </div>
        <Row xs={2} md={4} className="g-4 justify-content-center mt-4">
          {skillData.map((item) => (
            <Col key={item.id} className="text-center">
              <div>{item.skill}</div>
              <div>{item.name}</div>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  </Element>
);

export default Skills;
