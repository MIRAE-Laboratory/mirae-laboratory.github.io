import React, { useState, useEffect, useRef, useId } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Container, Spinner, Card, Badge, Button } from "react-bootstrap";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import mermaid from "mermaid";
import Title from "../components/Title";
import ScrollToTopButton from "../components/ScrollToTopButton";
import { updateTitle } from "../utils";
import { siteName } from "../config";

const baseUrl = process.env.PUBLIC_URL || "";

mermaid.initialize({ startOnLoad: false, theme: "neutral" });

const MermaidBlock = ({ source }) => {
  const ref = useRef(null);
  const id = useId().replace(/:/g, "");
  const [err, setErr] = useState(null);

  useEffect(() => {
    if (!ref.current || !source.trim()) return;
    setErr(null);
    const el = ref.current;
    el.textContent = source;
    mermaid
      .run({ nodes: [el], suppressErrors: false })
      .catch((e) => setErr(String(e.message || e)));
  }, [source]);

  if (err) {
    return (
      <pre className="bg-light p-3 small text-danger border rounded">
        Mermaid error: {err}
      </pre>
    );
  }
  return <div ref={ref} className="mermaid diagram-container" data-id={id} />;
};

const ArchiveDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const [frontmatter, setFrontmatter] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) {
      setError("Invalid archive item.");
      setLoading(false);
      return;
    }

    // 마크다운 파일 로드
    fetch(`${baseUrl}/contents/archive/${slug}.md`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load archive item.");
        return res.text();
      })
      .then((text) => {
        // Frontmatter 파싱
        const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
        if (match) {
          const yaml = match[1];
          const body = match[2].trim();
          
          // 간단한 frontmatter 파싱 (TLDR 등 멀티라인 | 지원)
          const fm = {};
          const lines = yaml.split(/\r?\n/);
          let currentKey = null;
          let arrayAcc = null;
          let multiLineKey = null;
          let multiLineLines = [];
          for (const line of lines) {
            if (multiLineKey !== null) {
              if (line.match(/^\s+\S/) || line.match(/^\s*-\s+/)) {
                multiLineLines.push(line.replace(/^\s+/, ""));
                continue;
              }
              fm[multiLineKey] = multiLineLines.join("\n").trim();
              multiLineKey = null;
              multiLineLines = [];
            }
            const arrayItem = line.match(/^\s*-\s+(.+)$/);
            if (arrayItem) {
              if (arrayAcc) {
                arrayAcc.push(arrayItem[1].replace(/^["']|["']$/g, ""));
              }
              continue;
            }
            const kv = line.match(/^(\w+):\s*(.*)$/);
            if (kv) {
              currentKey = kv[1];
              const raw = kv[2].trim();
              if (raw === "|" || raw === ">") {
                multiLineKey = currentKey;
                multiLineLines = [];
                continue;
              }
              if (raw === "" && (currentKey === "tags" || currentKey === "category" || currentKey === "tldr")) {
                arrayAcc = [];
                fm[currentKey] = arrayAcc;
              } else if (raw.startsWith("[")) {
                try {
                  fm[currentKey] = JSON.parse(raw.replace(/'/g, '"'));
                } catch {
                  fm[currentKey] = raw;
                }
                arrayAcc = null;
              } else if (raw.startsWith('"') || raw.startsWith("'")) {
                fm[currentKey] = raw.slice(1, -1).replace(/\\"/g, '"');
                arrayAcc = null;
              } else {
                fm[currentKey] = raw;
                arrayAcc = null;
              }
            }
          }
          if (multiLineKey !== null) {
            fm[multiLineKey] = multiLineLines.join("\n").trim();
          }
          
          setFrontmatter(fm);
          setContent(body);
        } else {
          setContent(text);
        }
        setError(null);
      })
      .catch((err) => {
        setError(err.message || "Failed to load archive item.");
      })
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    const title = frontmatter.title || slug || "Archive";
    updateTitle(`${title} | Archive | ${siteName}`);
  }, [frontmatter.title, slug]);

  if (loading) {
    return (
      <Container className="section py-5 d-flex justify-content-center align-items-center min-vh-50" aria-busy="true" aria-live="polite">
        <Spinner animation="border" variant="primary" role="status" aria-label="Loading archive detail" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="section py-5">
        <div className="text-center">
          <p style={{ color: "#dc3545" }}>{error}</p>
          <Button variant="primary" onClick={() => navigate("/Archive")}>
            Back to Archive
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <main className="section py-5">
      <Container>
        <div className="mb-4">
          <Button variant="outline-secondary" onClick={() => navigate("/Archive")} className="mb-3">
            ← Back to Archive
          </Button>
        </div>

        <Card className="shadow-sm" style={{ backgroundColor: "#ffffff", color: "#212529" }}>
          <Card.Body>
            <Card.Title className="mb-3" style={{ color: "#212529" }}>
              {frontmatter.title || slug || "Untitled"}
            </Card.Title>

            {(frontmatter.tldr ?? frontmatter.TLDR ?? frontmatter.abstract) && (() => {
              const raw = frontmatter.tldr ?? frontmatter.TLDR ?? frontmatter.abstract;
              const text = Array.isArray(raw) ? raw.join("\n") : raw;
              const lines = text.split(/\r?\n/).map((l) => l.replace(/^\s*-\s*/, "").trim()).filter(Boolean);
              if (lines.length === 0) return null;
              return (
                <div className="mb-3 p-3 rounded bg-light border-start border-primary border-3">
                  <ul className="mb-0 ps-3 small" style={{ whiteSpace: "pre-line" }}>
                    {lines.map((line, i) => (
                      <li key={i}>{line}</li>
                    ))}
                  </ul>
                </div>
              );
            })()}

            {(frontmatter.category || (frontmatter.tags && frontmatter.tags.length > 0)) && (
              <div className="mb-3">
                {frontmatter.category && (
                  <Badge bg="primary" className="me-1">
                    {Array.isArray(frontmatter.category) ? frontmatter.category[0] : frontmatter.category}
                  </Badge>
                )}
                {Array.isArray(frontmatter.tags) &&
                  frontmatter.tags.map((t) => (
                    <Badge key={t} bg="secondary" className="me-1">
                      {t}
                    </Badge>
                  ))}
              </div>
            )}

            <div className="d-flex justify-content-between align-items-center mb-3 small text-muted flex-wrap gap-2">
              <span>
                {frontmatter.date && <span>{frontmatter.date}</span>}
                {frontmatter.country && <span> · {frontmatter.country}</span>}
                {frontmatter.institute && <span> · {frontmatter.institute}</span>}
              </span>
              {frontmatter.source && (
                <a
                  href={frontmatter.source}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline-primary btn-sm"
                >
                  View Source
                </a>
              )}
            </div>

            <hr />

            <div className="markdown-content" style={{ color: "#212529" }}>
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ node, inline, className, children, ...props }) {
                    const isMermaid =
                      !inline && className?.includes("language-mermaid");
                    if (isMermaid) {
                      return (
                        <MermaidBlock
                          source={String(children ?? "").replace(/\n$/, "")}
                        />
                      );
                    }
                    return (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    );
                  },
                }}
              >
                {content}
              </ReactMarkdown>
            </div>
          </Card.Body>
        </Card>
      </Container>
      <ScrollToTopButton />
    </main>
  );
};

export default ArchiveDetail;
