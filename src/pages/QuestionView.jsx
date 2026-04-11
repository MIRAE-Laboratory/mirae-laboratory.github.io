import React, { useState, useEffect } from "react";
import { Container, Card, Badge } from "react-bootstrap";
import { updateTitle } from "../utils";
import { siteName } from "../config";
import { subscribeQuestions, subscribeMeta } from "../firebase";

const QuestionView = () => {
  const [questions, setQuestions] = useState([]);
  const [summary, setSummary] = useState("");
  const [generated, setGenerated] = useState("");

  useEffect(() => {
    updateTitle(`Questions | ${siteName}`);
  }, []);

  useEffect(() => {
    const unsub = subscribeQuestions((data) => setQuestions(data));
    return () => unsub();
  }, []);

  useEffect(() => {
    const unsub = subscribeMeta((data) => {
      setSummary(data.summary || "");
      setGenerated(data.generated || "");
    });
    return () => unsub();
  }, []);

  return (
    <main className="py-3 py-md-5" style={{ minHeight: "100vh" }}>
      <Container className="px-3 px-md-4" style={{ maxWidth: 800 }}>
        <h5 className="mb-4 text-center">Questions</h5>

        {/* Summary */}
        {summary && (
          <Card className="shadow-sm mb-3 border-primary">
            <Card.Header className="bg-primary text-white py-2 px-3">
              <strong style={{ fontSize: "0.9rem" }}>Summarized Questions</strong>
            </Card.Header>
            <Card.Body className="p-2 p-md-3">
              <pre
                className="mb-0"
                style={{
                  whiteSpace: "pre-wrap",
                  fontFamily: "inherit",
                  fontSize: "0.9rem",
                  wordBreak: "break-word",
                }}
              >
                {summary}
              </pre>
            </Card.Body>
          </Card>
        )}

        {/* Generated */}
        {generated && (
          <Card className="shadow-sm mb-3 border-success">
            <Card.Header className="bg-success text-white py-2 px-3">
              <strong style={{ fontSize: "0.9rem" }}>Generated Questions</strong>
            </Card.Header>
            <Card.Body className="p-2 p-md-3">
              <pre
                className="mb-0"
                style={{
                  whiteSpace: "pre-wrap",
                  fontFamily: "inherit",
                  fontSize: "0.9rem",
                  wordBreak: "break-word",
                }}
              >
                {generated}
              </pre>
            </Card.Body>
          </Card>
        )}

        {/* Submitted Questions */}
        <div className="mb-2 d-flex align-items-center gap-2">
          <strong style={{ fontSize: "0.95rem" }}>Submitted Questions</strong>
          <Badge bg="secondary">{questions.length}</Badge>
        </div>

        {questions.length === 0 ? (
          <p className="text-muted small">No questions submitted yet.</p>
        ) : (
          questions.map((q, i) => (
            <Card key={q.id} className="shadow-sm mb-2">
              <Card.Body className="py-2 px-3">
                <div style={{ wordBreak: "break-word", whiteSpace: "pre-wrap" }}>
                  <span className="text-muted me-2" style={{ fontSize: "0.8rem" }}>
                    {questions.length - i}.
                  </span>
                  {q.text}
                </div>
                <div className="text-end mt-1">
                  <small className="text-muted" style={{ fontSize: "0.75rem" }}>
                    {new Date(q.createdAt).toLocaleString("ko-KR")}
                  </small>
                </div>
              </Card.Body>
            </Card>
          ))
        )}
      </Container>
    </main>
  );
};

export default QuestionView;
