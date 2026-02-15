import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Container, Row, Col, Card, Spinner, Form, Badge } from "react-bootstrap";
import Title from "../components/Title";
import ScrollToTopButton from "../components/ScrollToTopButton";
import { archiveCategories } from "../config";
import { updateTitle } from "../utils";
import { siteName } from "../config";

const baseUrl = process.env.PUBLIC_URL || "";

const Archive = () => {
  const { categorySlug } = useParams();
  const [scraps, setScraps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [keyword, setKeyword] = useState("");
  const [countryFilter, setCountryFilter] = useState("");

  useEffect(() => {
    updateTitle(`Archive | ${siteName}`);
  }, []);

  useEffect(() => {
    fetch(`${baseUrl}/data/scraps-index.json`)
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then((data) => {
        setScraps(Array.isArray(data) ? data : []);
        setError(null);
      })
      .catch(() => setError("Failed to load archive."))
      .finally(() => setLoading(false));
  }, []);

  const slugNorm = (categorySlug || "").toLowerCase();
  const categoryBySlug = archiveCategories.find(
    (c) => (c.slug || "").toLowerCase() === slugNorm && c.id !== "all"
  );
  const currentCategory = categoryBySlug || archiveCategories.find((c) => c.id === "all");
  const categoryId = currentCategory?.id ?? "all";

  let filtered = scraps.filter((s) => {
    if (categoryId !== "all") {
      const cat = Array.isArray(s.category) ? s.category : [s.category];
      if (!cat.some((c) => c === categoryId)) return false;
    }
    if (keyword.trim()) {
      const k = keyword.trim().toLowerCase();
      const title = (s.title || "").toLowerCase();
      const tags = Array.isArray(s.tags) ? s.tags : [];
      const matchTag = tags.some((t) => String(t).toLowerCase().includes(k));
      if (!title.includes(k) && !matchTag) return false;
    }
    if (countryFilter.trim()) {
      const c = countryFilter.trim().toLowerCase();
      const country = (s.country || "").toLowerCase();
      const countries = Array.isArray(s.countries)
        ? s.countries.map((x) => String(x).toLowerCase())
        : [];
      if (!country.includes(c) && !countries.some((x) => x.includes(c))) return false;
    }
    return true;
  });

  if (loading) {
    return (
      <Container className="section py-5 d-flex justify-content-center align-items-center min-vh-50" aria-busy="true" aria-live="polite">
        <Spinner animation="border" variant="primary" role="status" aria-label="Loading archive" />
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
        <div className="d-flex justify-content-center mb-4">
          <Title size="h1" text="Archive" />
        </div>

        <div className="d-flex flex-wrap align-items-center gap-3 mb-4">
          <span className="me-2">Category:</span>
          {archiveCategories.map((c) => (
            <Link
              key={c.id}
              to={c.slug ? `/Archive/${c.slug}` : "/Archive"}
              className={
                (categorySlug || "") === c.slug || (c.id === "all" && categoryId === "all")
                  ? "fw-bold"
                  : ""
              }
              style={{
                color: (categorySlug || "") === c.slug || (c.id === "all" && categoryId === "all") ? "var(--bs-primary)" : "inherit",
              }}
            >
              {c.label}
            </Link>
          ))}
        </div>

        <Form className="mb-4 d-flex flex-wrap gap-2">
          <Form.Control
            type="search"
            placeholder="Search by keyword / tag..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            style={{ maxWidth: "280px" }}
            aria-label="Search by keyword or tag"
          />
          <Form.Control
            type="text"
            placeholder="Filter by country..."
            value={countryFilter}
            onChange={(e) => setCountryFilter(e.target.value)}
            style={{ maxWidth: "200px" }}
            aria-label="Filter by country"
          />
        </Form>

        <Row xs={1} md={2} lg={3} className="g-4 align-items-start">
          {filtered.map((s) => (
            <Col key={s.id}>
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  <Card.Title className="small">
                    {s.source ? (
                      <a href={s.source} target="_blank" rel="noopener noreferrer" className="text-decoration-none text-reset" aria-label={`${s.title || "Untitled"} (opens in new tab)`}>
                        {s.title || "Untitled"}
                      </a>
                    ) : (
                      s.title || "Untitled"
                    )}
                  </Card.Title>
                  {(s.category || (s.tags && s.tags.length)) && (
                    <div className="mb-2">
                      {s.category && (
                        <Badge bg="primary" className="me-1">
                          {Array.isArray(s.category) ? s.category[0] : s.category}
                        </Badge>
                      )}
                      {Array.isArray(s.tags) &&
                        s.tags.slice(0, 3).map((t) => (
                          <Badge key={t} bg="secondary" className="me-1">
                            {t}
                          </Badge>
                        ))}
                    </div>
                  )}
                  {s.abstract && (
                    <Card.Text className="small text-muted">{s.abstract}</Card.Text>
                  )}
                  <Card.Text className="small mb-1">
                    {s.date}
                    {s.country && ` · ${s.country}`}
                    {s.institute && ` · ${s.institute}`}
                  </Card.Text>
                  {s.source && (
                    <a
                      href={s.source}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="small"
                    >
                      Source
                    </a>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
        {filtered.length === 0 && (
          <p className="text-center text-muted">No items match the filters.</p>
        )}
      </Container>
      <ScrollToTopButton />
    </main>
  );
};

export default Archive;
