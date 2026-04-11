import React, { useState, useEffect, useCallback } from "react";
import { Container, Card, Form, Button, Badge } from "react-bootstrap";
import ScrollToTopButton from "../components/ScrollToTopButton";
import { updateTitle } from "../utils";
import { siteName } from "../config";
import { subscribeQuestions, subscribeMeta, addQuestion } from "../firebase";

/** Render text as numbered lines (split by newline, skip empty) */
const NumberedLines = ({ text }) => {
  const lines = text.split("\n").filter((l) => l.trim());
  return (
    <div style={{ fontSize: "0.9rem", wordBreak: "break-word" }}>
      {lines.map((line, i) => (
        <div key={i} className="mb-1">
          <span className="text-muted me-2">{i + 1}.</span>
          {line.trim()}
        </div>
      ))}
    </div>
  );
};

const QuestionCollect = () => {
  const [input, setInput] = useState("");
  const [questions, setQuestions] = useState([]);
  const [summary, setSummary] = useState("");
  const [generated, setGenerated] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    updateTitle(`Question Collect | ${siteName}`);
  }, []);

  // Real-time subscription to questions
  useEffect(() => {
    const unsub = subscribeQuestions((data) => setQuestions(data));
    return () => unsub();
  }, []);

  // Real-time subscription to meta (summary & generated)
  useEffect(() => {
    const unsub = subscribeMeta((data) => {
      setSummary(data.summary || "");
      setGenerated(data.generated || "");
    });
    return () => unsub();
  }, []);

  const handleSend = useCallback(async () => {
    const text = input.trim();
    if (!text || sending) return;
    setSending(true);
    try {
      await addQuestion(text);
      setInput("");
    } catch (err) {
      console.error("Failed to send question:", err);
    } finally {
      setSending(false);
    }
  }, [input, sending]);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  return (
    <main className="py-3 py-md-5" style={{ minHeight: "100vh" }}>
      <Container className="px-3 px-md-4" style={{ maxWidth: 720 }}>
        <h5 className="mb-3 text-center">Question Collect</h5>

        {/* Input area - sticky on mobile */}
        <Card className="shadow-sm mb-3">
          <Card.Body className="p-2 p-md-3">
            <Form.Control
              as="textarea"
              rows={2}
              placeholder="Enter your question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="mb-2"
              style={{ fontSize: "16px" }}
            />
            <div className="d-flex justify-content-end">
              <Button
                variant="primary"
                onClick={handleSend}
                disabled={!input.trim() || sending}
                className="px-4"
              >
                {sending ? "Sending..." : "Send"}
              </Button>
            </div>
          </Card.Body>
        </Card>

        {/* Summary section */}
        {summary && (
          <Card className="shadow-sm mb-3 border-primary">
            <Card.Header className="bg-primary text-white py-2 px-3">
              <strong style={{ fontSize: "0.9rem" }}>Summarized Questions</strong>
            </Card.Header>
            <Card.Body className="p-2 p-md-3">
              <NumberedLines text={summary} />
            </Card.Body>
          </Card>
        )}

        {/* Generated questions section */}
        {generated && (
          <Card className="shadow-sm mb-3 border-success">
            <Card.Header className="bg-success text-white py-2 px-3">
              <strong style={{ fontSize: "0.9rem" }}>Generated Questions</strong>
            </Card.Header>
            <Card.Body className="p-2 p-md-3">
              <NumberedLines text={generated} />
            </Card.Body>
          </Card>
        )}

        {/* Questions list */}
        <div className="mb-2 d-flex align-items-center gap-2">
          <strong style={{ fontSize: "0.95rem" }}>Submitted Questions</strong>
          <Badge bg="secondary">{questions.length}</Badge>
        </div>

        {questions.length === 0 ? (
          <p className="text-muted small">No questions submitted yet.</p>
        ) : (
          questions.map((q) => (
            <Card key={q.id} className="shadow-sm mb-2">
              <Card.Body className="py-2 px-3">
                <div style={{ wordBreak: "break-word", whiteSpace: "pre-wrap" }}>
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
      <ScrollToTopButton />
    </main>
  );
};

export default QuestionCollect;
