import React, { useEffect } from "react";
import { Container } from "react-bootstrap";
import Contact from "../components/Contact";
import ScrollToTopButton from "../components/ScrollToTopButton";
import { updateTitle } from "../utils";
import { siteName } from "../config";

const ContactPage = () => {
  useEffect(() => {
    updateTitle(`Contact | ${siteName}`);
  }, []);

  return (
    <main className="section py-5">
      <Container>
        <Contact />
      </Container>
      <ScrollToTopButton />
    </main>
  );
};

export default ContactPage;
