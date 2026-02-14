import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Spinner, Accordion } from "react-bootstrap";
import Title from "../components/Title";
import ScrollToTopButton from "../components/ScrollToTopButton";
import { updateTitle } from "../utils";
import { siteName } from "../config";

const baseUrl = process.env.PUBLIC_URL || "";

const Professor = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    updateTitle(`Professor | ${siteName}`);
  }, []);

  useEffect(() => {
    fetch(`${baseUrl}/data/professor.json`)
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then((data) => {
        setProfile(data);
        setError(null);
      })
      .catch(() => setError("Failed to load professor profile."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Container className="section py-5 d-flex justify-content-center align-items-center min-vh-50" aria-busy="true" aria-live="polite">
        <Spinner animation="border" variant="primary" role="status" aria-label="Loading professor" />
      </Container>
    );
  }

  if (error || !profile) {
    return (
      <Container className="section py-5">
        <p className="text-center text-danger">{error || "No profile data."}</p>
      </Container>
    );
  }

  const researchAreas = profile.researchAreas || [];
  const education = profile.education || [];
  const awards = profile.awards || [];
  const imageUrl = profile.imageUrl || null;
  const fullProfileUrl = profile.fullProfileUrl || "";
  const careerTeaching = profile.careerTeaching || [];
  const careerTransfer = profile.careerTransfer || [];
  const careerRnd = profile.careerRnd || [];
  const publicationsInternational = profile.publicationsInternational || [];
  const publicationsDomestic = profile.publicationsDomestic || [];
  const patents = profile.patents || [];
  const software = profile.software || [];
  const books = profile.books || [];
  const contributions = profile.contributions || [];
  const media = profile.media || [];

  const renderLinkableText = (text) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);
    return parts.map((part, i) =>
      part.match(urlRegex) ? (
        <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="text-break">{part}</a>
      ) : (
        part
      )
    );
  };

  return (
    <main className="section py-5">
      <Container>
        <div className="d-flex justify-content-center mb-4">
          <Title size="h1" text="Professor" />
        </div>

        <Card className="shadow-sm mb-5">
          <Card.Body>
            <Row>
              <Col md={4} className="text-center mb-3 mb-md-0">
                {imageUrl ? (
                  <>
                    <img
                      src={imageUrl}
                      alt={profile.name || ""}
                      className="img-fluid rounded"
                      style={{ maxHeight: "280px", objectFit: "contain" }}
                      onError={(e) => {
                        e.target.style.display = "none";
                        const fallback = e.target.nextElementSibling;
                        if (fallback) fallback.style.display = "flex";
                      }}
                    />
                    <div
                      className="rounded bg-secondary text-white d-none align-items-center justify-content-center"
                      style={{ height: "200px" }}
                      aria-hidden
                    >
                      <span style={{ fontSize: "4rem" }}>{(profile.name || "").charAt(0) || "?"}</span>
                    </div>
                  </>
                ) : (
                  <div
                    className="rounded bg-secondary text-white d-flex align-items-center justify-content-center mx-auto"
                    style={{ width: "200px", height: "200px" }}
                    aria-hidden
                  >
                    <span style={{ fontSize: "4rem" }}>{(profile.name || "").charAt(0) || "?"}</span>
                  </div>
                )}
              </Col>
              <Col md={8}>
                <Card.Title className="h3">
                  {profile.name}
                  {profile.nameEn ? ` (${profile.nameEn})` : ""}
                </Card.Title>
                {profile.title1 && (
                  <Card.Subtitle className="text-muted mb-2">{profile.title1}</Card.Subtitle>
                )}
                {profile.title2 && (
                  <Card.Subtitle className="text-muted mb-2">{profile.title2}</Card.Subtitle>
                )}
                {profile.title3 && (
                  <Card.Subtitle className="text-muted mb-3">{profile.title3}</Card.Subtitle>
                )}
                {profile.contactTel && (
                  <p className="mb-1">
                    <strong>Tel:</strong> {profile.contactTel}
                  </p>
                )}
                {profile.contactEmail && (
                  <p className="mb-0">
                    <strong>Email:</strong>{" "}
                    <a href={`mailto:${profile.contactEmail}`}>{profile.contactEmail}</a>
                  </p>
                )}
                {fullProfileUrl && (
                  <a
                    href={fullProfileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline-primary btn-sm mt-3"
                  >
                    전체 프로필 보기 (miraelab.re.kr)
                  </a>
                )}
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {researchAreas.length > 0 && (
          <Card className="shadow-sm mb-4">
            <Card.Header as="h5" className="bg-transparent border-bottom-0">
              연구분야
            </Card.Header>
            <Card.Body>
              {researchAreas.map((area, i) => (
                <div key={i} className="mb-4">
                  <h6 className="text-primary">{area.title}</h6>
                  <ul className="small mb-0">
                    {(area.items || []).map((item, j) => (
                      <li key={j}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </Card.Body>
          </Card>
        )}

        <Row>
          {education.length > 0 && (
            <Col lg={6}>
              <Card className="shadow-sm mb-4">
                <Card.Header as="h5" className="bg-transparent border-bottom-0">
                  학력 및 이력
                </Card.Header>
                <Card.Body>
                  <ul className="small list-unstyled mb-0">
                    {education.map((e, i) => (
                      <li key={i} className="mb-2">
                        <span className="text-muted">{e.period}</span>
                        <br />
                        <strong>{e.role}</strong> · {e.org}
                      </li>
                    ))}
                  </ul>
                </Card.Body>
              </Card>
            </Col>
          )}
          {awards.length > 0 && (
            <Col lg={6}>
              <Card className="shadow-sm mb-4">
                <Card.Header as="h5" className="bg-transparent border-bottom-0">
                  장학수혜 및 수상 (최근)
                </Card.Header>
                <Card.Body>
                  <ul className="small mb-0">
                    {awards.map((a, i) => (
                      <li key={i} className="mb-1">
                        {a}
                      </li>
                    ))}
                  </ul>
                  {fullProfileUrl && (
                    <p className="small text-muted mt-2 mb-0">
                      전체 목록은{" "}
                      <a href={fullProfileUrl} target="_blank" rel="noopener noreferrer">
                        miraelab.re.kr
                      </a>
                      에서 확인할 수 있습니다.
                    </p>
                  )}
                </Card.Body>
              </Card>
            </Col>
          )}
        </Row>

        {(careerTeaching.length > 0 || careerTransfer.length > 0 || careerRnd.length > 0 ||
          publicationsInternational.length > 0 || publicationsDomestic.length > 0 ||
          patents.length > 0 || software.length > 0 || books.length > 0 ||
          contributions.length > 0 || media.length > 0) && (
          <Accordion defaultActiveKey="" className="mb-4" flush>
            {careerTeaching.length > 0 && (
              <Accordion.Item eventKey="careerTeaching">
                <Accordion.Header>경력 · 강의 및 자문</Accordion.Header>
                <Accordion.Body>
                  <ul className="small list-unstyled mb-0">
                    {careerTeaching.map((e, i) => (
                      <li key={i} className="mb-2">
                        <span className="text-muted">{e.period}</span> · <strong>{e.role}</strong> · {e.org}
                      </li>
                    ))}
                  </ul>
                </Accordion.Body>
              </Accordion.Item>
            )}
            {careerTransfer.length > 0 && (
              <Accordion.Item eventKey="careerTransfer">
                <Accordion.Header>경력 · 기술이전</Accordion.Header>
                <Accordion.Body>
                  <ul className="small list-unstyled mb-0">
                    {careerTransfer.map((e, i) => (
                      <li key={i} className="mb-2">
                        <span className="text-muted">{e.period}</span> · {e.title} · {e.org}
                      </li>
                    ))}
                  </ul>
                </Accordion.Body>
              </Accordion.Item>
            )}
            {careerRnd.length > 0 && (
              <Accordion.Item eventKey="careerRnd">
                <Accordion.Header>경력 · 연구개발</Accordion.Header>
                <Accordion.Body>
                  <ul className="small list-unstyled mb-0">
                    {careerRnd.map((e, i) => (
                      <li key={i} className="mb-2">
                        <span className="text-muted">{e.period}</span> · {e.title} · {e.org}
                      </li>
                    ))}
                  </ul>
                </Accordion.Body>
              </Accordion.Item>
            )}
            {publicationsInternational.length > 0 && (
              <Accordion.Item eventKey="pubInt">
                <Accordion.Header>국제학술지 (SCI/SCIE 등)</Accordion.Header>
                <Accordion.Body>
                  <ul className="small mb-0">
                    {publicationsInternational.map((p, i) => (
                      <li key={i} className="mb-2">{renderLinkableText(p)}</li>
                    ))}
                  </ul>
                </Accordion.Body>
              </Accordion.Item>
            )}
            {publicationsDomestic.length > 0 && (
              <Accordion.Item eventKey="pubDom">
                <Accordion.Header>국내학술지 (KCI 등)</Accordion.Header>
                <Accordion.Body>
                  <ul className="small mb-0">
                    {publicationsDomestic.map((p, i) => (
                      <li key={i} className="mb-2">{renderLinkableText(p)}</li>
                    ))}
                  </ul>
                </Accordion.Body>
              </Accordion.Item>
            )}
            {patents.length > 0 && (
              <Accordion.Item eventKey="patents">
                <Accordion.Header>특허 등록</Accordion.Header>
                <Accordion.Body>
                  <ul className="small mb-0">
                    {patents.map((p, i) => (
                      <li key={i} className="mb-1">{p}</li>
                    ))}
                  </ul>
                </Accordion.Body>
              </Accordion.Item>
            )}
            {software.length > 0 && (
              <Accordion.Item eventKey="software">
                <Accordion.Header>프로그램 등록</Accordion.Header>
                <Accordion.Body>
                  <ul className="small mb-0">
                    {software.map((s, i) => (
                      <li key={i} className="mb-1">{s}</li>
                    ))}
                  </ul>
                </Accordion.Body>
              </Accordion.Item>
            )}
            {books.length > 0 && (
              <Accordion.Item eventKey="books">
                <Accordion.Header>저서</Accordion.Header>
                <Accordion.Body>
                  <ul className="small mb-0">
                    {books.map((b, i) => (
                      <li key={i} className="mb-2">{renderLinkableText(b)}</li>
                    ))}
                  </ul>
                </Accordion.Body>
              </Accordion.Item>
            )}
            {contributions.length > 0 && (
              <Accordion.Item eventKey="contributions">
                <Accordion.Header>기고</Accordion.Header>
                <Accordion.Body>
                  <ul className="small mb-0">
                    {contributions.map((c, i) => (
                      <li key={i} className="mb-2">{renderLinkableText(c)}</li>
                    ))}
                  </ul>
                </Accordion.Body>
              </Accordion.Item>
            )}
            {media.length > 0 && (
              <Accordion.Item eventKey="media">
                <Accordion.Header>언론보도</Accordion.Header>
                <Accordion.Body>
                  <ul className="small mb-0">
                    {media.map((m, i) => (
                      <li key={i} className="mb-2">{renderLinkableText(m)}</li>
                    ))}
                  </ul>
                </Accordion.Body>
              </Accordion.Item>
            )}
          </Accordion>
        )}
      </Container>
      <ScrollToTopButton />
    </main>
  );
};

export default Professor;
