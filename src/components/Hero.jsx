import React from "react";
import { Container } from "react-bootstrap";

const Hero = ({ name }) => (
  <section className="d-flex align-items-center min-vh-100" style={{ paddingTop: "var(--nav-height)" }}>
    <Container className="text-center">
      <h1 className="display-4">{name || "Research Lab"}</h1>
      <p className="lead text-muted">Multi-modal Intelligent Reasoning and Active Evaluation Laboratory</p>
    </Container>
  </section>
);

export default Hero;
