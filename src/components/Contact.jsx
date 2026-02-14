import React from "react";
import { Element } from "react-scroll";
import { Container } from "react-bootstrap";
import Title from "./Title";
import ContactForm from "./ContactForm";

const Contact = () => (
  <Element name="Contact" id="contact">
    <section className="section">
      <Container>
        <div className="d-flex justify-content-center">
          <Title size="h2" text="Contact" />
        </div>
        <ContactForm />
      </Container>
    </section>
  </Element>
);

export default Contact;
