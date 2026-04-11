import React, { useState, useEffect, useCallback } from "react";
import { Container, Card, Form, Button, Badge } from "react-bootstrap";
import ScrollToTopButton from "../components/ScrollToTopButton";
import { updateTitle } from "../utils";
import { siteName } from "../config";
import { subscribeQuestions, subscribeMeta, addQuestion } from "../firebase";

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
    <main className="section py-5">
      <Container style={{ maxWidth: 720 }}>
        <h4 className="mb-4">Question Collect</h4>

        {/* Input area */}
        <Card className="shadow-sm mb-4">
          <Card.Body>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Enter your question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="mb-2"
            />
            <div className="d-flex justify-content-end">
              <Button
                variant="primary"
                size="sm"
                onClick={handleSend}
                disabled={!input.trim() || sending}
              >
                {sending ? "Sending..." : "Send"}
              </Button>
            </div>
          </Card.Body>
        </Card>

        {/* Summary section */}
        {summary && (
          <Card className="shadow-sm mb-4 border-primary">
            <Card.Header className="bg-primary text-white d-flex align-items-center gap-2">
              <strong>Summarized Questions</strong>
              <Badge bg="light" text="dark">
                Summary
              </Badge>
            </Card.Header>
            <Card.Body>
              <pre
                className="mb-0"
                style={{ whiteSpace: "pre-wrap", fontFamily: "inherit" }}
              >
                {summary}
              </pre>
            </Card.Body>
          </Card>
        )}

        {/* Generated questions section */}
        {generated && (
          <Card className="shadow-sm mb-4 border-success">
            <Card.Header className="bg-success text-white d-flex align-items-center gap-2">
              <strong>Generated Questions</strong>
              <Badge bg="light" text="dark">
                Generated
              </Badge>
            </Card.Header>
            <Card.Body>
              <pre
                className="mb-0"
                style={{ whiteSpace: "pre-wrap", fontFamily: "inherit" }}
              >
                {generated}
              </pre>
            </Card.Body>
          </Card>
        )}

        {/* Questions list */}
        <div className="mb-2 d-flex align-items-center gap-2">
          <strong>Submitted Questions</strong>
          <Badge bg="secondary">{questions.length}</Badge>
        </div>

        {questions.length === 0 ? (
          <p className="text-muted small">No questions submitted yet.</p>
        ) : (
          questions.map((q) => (
            <Card key={q.id} className="shadow-sm mb-2">
              <Card.Body className="py-2 px-3">
                <div className="d-flex justify-content-between align-items-start">
                  <span style={{ whiteSpace: "pre-wrap" }}>{q.text}</span>
                  <small className="text-muted ms-3" style={{ flexShrink: 0 }}>
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
