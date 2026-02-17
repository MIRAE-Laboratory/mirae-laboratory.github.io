import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Card, Spinner, Badge } from "react-bootstrap";
import Title from "../components/Title";
import ScrollToTopButton from "../components/ScrollToTopButton";
import { Icon } from "@iconify/react";
import { updateTitle } from "../utils";
import { siteName } from "../config";

const baseUrl = process.env.PUBLIC_URL || "";

// 저자명 필터링 (Hogeon Seo 또는 서호건이 포함된 항목만)
const AUTHOR_NAMES = ["Hogeon Seo", "서호건", "Hogeon", "Seo"];

const typeLabel = (type) => {
  const map = {
    journal: "Journal",
    conference: "Conference",
    patent: "Patent",
    code: "Code",
    poster: "Poster",
    other: "Other",
  };
  return map[type] || type;
};

const Achievements = () => {
  const [archive, setArchive] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    updateTitle(`Achievements | ${siteName}`);
  }, []);

  useEffect(() => {
    fetch(`${baseUrl}/data/archive-index.json`)
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then((data) => {
        const archiveData = Array.isArray(data) ? data : [];
        // 저자 필터링: authors 배열에 지정된 저자명이 포함된 항목만
        const filtered = archiveData.filter((item) => {
          const authors = Array.isArray(item.authors) ? item.authors : [];
          return authors.some((author) =>
            AUTHOR_NAMES.some((name) =>
              String(author).toLowerCase().includes(name.toLowerCase())
            )
          );
        });
        setArchive(filtered);
        setError(null);
      })
      .catch(() => setError("Failed to load achievements."))
      .finally(() => setLoading(false));
  }, []);

  // 카테고리 동적 추출
  const categories = React.useMemo(() => {
    const cats = new Set();
    archive.forEach((item) => {
      if (item.category) {
        cats.add(item.category);
      }
      if (item.type) {
        cats.add(item.type);
      }
    });
    return ["all", ...Array.from(cats).sort()];
  }, [archive]);

  const filtered =
    filter === "all"
      ? archive
      : archive.filter(
          (p) =>
            (p.category || "").toLowerCase() === filter.toLowerCase() ||
            (p.type || "").toLowerCase() === filter.toLowerCase()
        );

  if (loading) {
    return (
      <Container
        className="section py-5 d-flex justify-content-center align-items-center min-vh-50"
        aria-busy="true"
        aria-live="polite"
      >
        <Spinner
          animation="border"
          variant="primary"
          role="status"
          aria-label="Loading achievements"
        />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="section py-5">
        <p className="text-center" style={{ color: "#dc3545" }}>{error}</p>
      </Container>
    );
  }

  return (
    <main className="section py-5">
      <Container>
        <div className="d-flex justify-content-center mb-4">
          <Title size="h1" text="Achievements" />
        </div>
        <div
          className="d-flex flex-wrap justify-content-center gap-2 mb-4"
          role="group"
          aria-label="Filter by category"
        >
          {categories.map((cat) => (
            <Badge
              key={cat}
              bg={filter === cat ? "primary" : "secondary"}
              className="px-3 py-2"
              role="button"
              tabIndex={0}
              onClick={() => setFilter(cat)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setFilter(cat);
                }
              }}
              style={{ cursor: "pointer" }}
            >
              {cat === "all" ? "All" : typeLabel(cat) || cat}
            </Badge>
          ))}
        </div>
        <Row xs={1} className="g-4 align-items-start">
          {filtered.map((item) => (
            <Col key={item.id}>
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
                    <Card.Title className="mb-1">
                      <Link
                        to={`/Archive/item/${item.slug}`}
                        className="text-decoration-none text-reset"
                        style={{ color: "inherit" }}
                      >
                        {item.title || "Untitled"}
                      </Link>
                    </Card.Title>
                    {(item.category || item.type) && (
                      <Badge bg="primary">
                        {typeLabel(item.type) || item.category}
                      </Badge>
                    )}
                  </div>
                  {Array.isArray(item.authors) && item.authors.length > 0 && (
                    <Card.Subtitle className="mb-2 text-muted small">
                      {item.authors.join(", ")}
                    </Card.Subtitle>
                  )}
                  <div className="d-flex justify-content-between align-items-center small mb-1 flex-wrap gap-2">
                    <Card.Text className="mb-0 text-muted">
                      {item.date}
                      {item.country && ` · ${item.country}`}
                      {item.institute && ` · ${item.institute}`}
                    </Card.Text>
                    {item.source && (
                      <a
                        href={item.source}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="small"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Icon icon="mdi:open-in-new" /> View Source
                      </a>
                    )}
                  </div>
                  {(item.TLDR || item.abstract) && (() => {
                    const raw = (item.TLDR || item.abstract) || "";
                    const lines = raw.split(/\r?\n/).map((l) => l.replace(/^\s*-\s*/, "").trim()).filter(Boolean);
                    if (lines.length === 0) return null;
                    return (
                      <Card.Text as="div" className="small text-muted mb-1">
                        <ul className="mb-0 ps-3">
                          {lines.map((line, i) => (
                            <li key={i}>{line}</li>
                          ))}
                        </ul>
                      </Card.Text>
                    );
                  })()}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
        {filtered.length === 0 && (
          <p className="text-center text-muted">
            No achievements in this category.
          </p>
        )}
      </Container>
      <ScrollToTopButton />
    </main>
  );
};

export default Achievements;
