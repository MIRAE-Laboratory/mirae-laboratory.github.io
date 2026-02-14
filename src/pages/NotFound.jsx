import React from "react";
import { Container } from "react-bootstrap";
import { updateTitle } from "../utils";
import { siteName } from "../config";

const NotFound = () => {
  React.useEffect(() => {
    updateTitle("Page not found | " + siteName);
  }, []);

  return (
    <main className="d-flex flex-column justify-content-center align-items-center min-vh-100">
      <Container className="text-center">
        <span style={{ fontSize: "4rem" }}>404</span>
        <p className="lead">Page not found.</p>
      </Container>
    </main>
  );
};

export default NotFound;
