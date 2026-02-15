import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Spinner } from "react-bootstrap";
import Title from "../components/Title";
import ScrollToTopButton from "../components/ScrollToTopButton";
import { updateTitle } from "../utils";
import { siteName } from "../config";

const baseUrl = process.env.PUBLIC_URL || "";

const People = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    updateTitle(`People | ${siteName}`);
  }, []);

  useEffect(() => {
    fetch(`${baseUrl}/data/members.json`)
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then((data) => {
        setMembers(Array.isArray(data) ? data : []);
        setError(null);
      })
      .catch(() => setError("Failed to load members."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Container className="section py-5 d-flex justify-content-center align-items-center min-vh-50" aria-busy="true" aria-live="polite">
        <Spinner animation="border" variant="primary" role="status" aria-label="Loading members" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="section py-5">
        <p className="text-center text-danger">{error}</p>
      </Container>
    );
  }

  return (
    <main className="section py-5">
      <Container>
        <div className="d-flex justify-content-center mb-5">
          <Title size="h1" text="People" />
        </div>
        <Row xs={1} md={2} lg={3} className="g-4 justify-content-center align-items-start">
          {members.map((m) => (
            <Col key={m.id}>
              <Card className="h-100 shadow-sm">
                <Card.Body className="text-center">
                  {m.avatar ? (
                    <img
                      src={m.avatar.startsWith("http") ? m.avatar : baseUrl + m.avatar}
                      alt={m.name}
                      className="rounded-circle mb-3"
                      style={{ width: "8rem", height: "8rem", objectFit: "cover" }}
                    />
                  ) : (
                    <div
                      className="rounded-circle mb-3 mx-auto d-flex align-items-center justify-content-center bg-secondary text-white"
                      style={{ width: "8rem", height: "8rem" }}
                      aria-hidden
                    >
                      <span style={{ fontSize: "2rem" }}>
                        {m.name ? m.name.charAt(0).toUpperCase() : "?"}
                      </span>
                    </div>
                  )}
                  <Card.Title>{m.name || "—"}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    {m.role || "—"}
                  </Card.Subtitle>
                  {m.bio && <Card.Text className="small">{m.bio}</Card.Text>}
                  {m.researchAreas?.length > 0 && (
                    <Card.Text className="small text-muted">
                      {m.researchAreas.join(", ")}
                    </Card.Text>
                  )}
                  {(m.email || m.link) && (
                    <div className="mt-2">
                      {m.email && (
                        <a href={`mailto:${m.email}`} className="me-2 small">
                          Email
                        </a>
                      )}
                      {m.link && (
                        <a href={m.link} target="_blank" rel="noopener noreferrer" className="small">
                          Link
                        </a>
                      )}
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
        {members.length === 0 && (
          <p className="text-center text-muted">No members listed yet.</p>
        )}
      </Container>
      <ScrollToTopButton />
    </main>
  );
};

export default People;
