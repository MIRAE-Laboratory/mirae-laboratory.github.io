import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Spinner, Badge } from "react-bootstrap";
import Title from "../components/Title";
import ScrollToTopButton from "../components/ScrollToTopButton";
import { Icon } from "@iconify/react";
import { updateTitle } from "../utils";
import { siteName } from "../config";

const baseUrl = process.env.PUBLIC_URL || "";

const typeLabel = (type) => {
  const map = { journal: "Journal", conference: "Conference", patent: "Patent", poster: "Poster", other: "Other" };
  return map[type] || type;
};

const Publications = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    updateTitle(`Publications | ${siteName}`);
  }, []);

  useEffect(() => {
    fetch(`${baseUrl}/data/publications.json`)
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then((data) => {
        setItems(Array.isArray(data) ? data : []);
        setError(null);
      })
      .catch(() => setError("Failed to load publications."))
      .finally(() => setLoading(false));
  }, []);

  const filtered =
    filter === "all"
      ? items
      : items.filter((p) => (p.type || "").toLowerCase() === filter.toLowerCase());

  if (loading) {
    return (
      <Container className="section py-5 d-flex justify-content-center align-items-center min-vh-50" aria-busy="true" aria-live="polite">
        <Spinner animation="border" variant="primary" role="status" aria-label="Loading publications" />
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

  const types = ["all", ...new Set(items.map((p) => (p.type || "other").toLowerCase()))];

  return (
    <main className="section py-5">
      <Container>
        <div className="d-flex justify-content-center mb-4">
          <Title size="h1" text="Publications" />
        </div>
        <div className="d-flex flex-wrap justify-content-center gap-2 mb-4" role="group" aria-label="Filter by type">
          {types.map((t) => (
            <Badge
              key={t}
              bg={filter === t ? "primary" : "secondary"}
              className="px-3 py-2"
              role="button"
              tabIndex={0}
              onClick={() => setFilter(t)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setFilter(t);
                }
              }}
              style={{ cursor: "pointer" }}
            >
              {t === "all" ? "All" : typeLabel(t)}
            </Badge>
          ))}
        </div>
        <Row xs={1} className="g-4 align-items-start">
          {filtered.map((p) => (
            <Col key={p.id}>
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
                    <Card.Title className="mb-1">{p.title || "Untitled"}</Card.Title>
                    <Badge bg="primary">{typeLabel(p.type)}</Badge>
                  </div>
                  <Card.Subtitle className="mb-2 text-muted small">
                    {Array.isArray(p.authors) ? p.authors.join(", ") : p.authors}
                  </Card.Subtitle>
                  <Card.Text className="small mb-1">
                    {p.venue} {p.year != null && `(${p.year})`}
                  </Card.Text>
                  {p.abstract && (
                    <Card.Text className="small text-muted">{p.abstract}</Card.Text>
                  )}
                  <div className="mt-2">
                    {p.doi && (
                      <a
                        href={`https://doi.org/${p.doi}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="me-3 small"
                      >
                        DOI
                      </a>
                    )}
                    {p.url && (
                      <a
                        href={p.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="small"
                      >
                        <Icon icon="mdi:open-in-new" /> Link
                      </a>
                    )}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
        {filtered.length === 0 && (
          <p className="text-center text-muted">No publications in this category.</p>
        )}
      </Container>
      <ScrollToTopButton />
    </main>
  );
};

export default Publications;
