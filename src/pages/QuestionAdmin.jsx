import React, { useState, useEffect, useCallback } from "react";
import {
  Container,
  Card,
  Form,
  Button,
  Badge,
  Row,
  Col,
  InputGroup,
  Spinner,
  Alert,
} from "react-bootstrap";
import ScrollToTopButton from "../components/ScrollToTopButton";
import { updateTitle } from "../utils";
import { siteName } from "../config";
import {
  subscribeQuestions,
  subscribeMeta,
  updateMeta,
  deleteQuestion,
  deleteAllQuestions,
} from "../firebase";

const STORAGE_KEY_GEMINI_KEY = "qc_gemini_api_key";

const callGemini = async (apiKey, prompt) => {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `API error ${res.status}`);
  }
  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
};

const QuestionAdmin = () => {
  const [questions, setQuestions] = useState([]);
  const [summary, setSummary] = useState("");
  const [generated, setGenerated] = useState("");

  const [apiKey, setApiKey] = useState(
    () => localStorage.getItem(STORAGE_KEY_GEMINI_KEY) || ""
  );
  const [summaryCount, setSummaryCount] = useState(3);
  const [conversationContent, setConversationContent] = useState("");
  const [generationPrompt, setGenerationPrompt] = useState("");
  const [loading, setLoading] = useState(null); // "summary" | "generate" | null
  const [error, setError] = useState("");

  useEffect(() => {
    updateTitle(`Question Admin | ${siteName}`);
  }, []);

  // Persist API key locally
  useEffect(() => {
    if (apiKey) localStorage.setItem(STORAGE_KEY_GEMINI_KEY, apiKey);
    else localStorage.removeItem(STORAGE_KEY_GEMINI_KEY);
  }, [apiKey]);

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

  // --- Summarize questions via Gemini ---
  const handleSummarize = useCallback(async () => {
    if (questions.length === 0) return;
    if (!apiKey.trim()) {
      setError("Please enter your Gemini API key.");
      return;
    }
    setError("");
    setLoading("summary");
    try {
      const questionList = questions
        .map((q, i) => `${i + 1}. ${q.text}`)
        .join("\n");
      const prompt = `Below is a list of questions submitted by an audience. Please analyze them and extract exactly ${summaryCount} key questions that best represent the core concerns and themes. Output only the numbered list of key questions, in the same language as the originals.\n\nQuestions:\n${questionList}`;
      const result = await callGemini(apiKey, prompt);
      const trimmed = result.trim();
      setSummary(trimmed);
      await updateMeta({ summary: trimmed });
    } catch (err) {
      setError(`Summary failed: ${err.message}`);
    } finally {
      setLoading(null);
    }
  }, [questions, summaryCount, apiKey]);

  // --- Generate questions from conversation via Gemini ---
  const handleGenerate = useCallback(async () => {
    const content = conversationContent.trim();
    if (!content) return;
    if (!apiKey.trim()) {
      setError("Please enter your Gemini API key.");
      return;
    }
    setError("");
    setLoading("generate");
    try {
      const userPrompt = generationPrompt.trim();
      const prompt = userPrompt
        ? `${userPrompt}\n\nBased on the following conversation content, generate relevant questions.\n\nConversation:\n${content}`
        : `Based on the following conversation content, generate insightful questions that the audience might want to ask. Output only the numbered list of questions, in the same language as the conversation.\n\nConversation:\n${content}`;
      const result = await callGemini(apiKey, prompt);
      const trimmed = result.trim();
      setGenerated(trimmed);
      await updateMeta({ generated: trimmed });
    } catch (err) {
      setError(`Generation failed: ${err.message}`);
    } finally {
      setLoading(null);
    }
  }, [conversationContent, generationPrompt, apiKey]);

  // --- Reset handlers ---
  const handleResetSummary = useCallback(async () => {
    setSummary("");
    await updateMeta({ summary: "" });
  }, []);

  const handleResetGenerated = useCallback(async () => {
    setGenerated("");
    await updateMeta({ generated: "" });
  }, []);

  const handleResetQuestions = useCallback(async () => {
    await deleteAllQuestions(questions);
    setQuestions([]);
  }, [questions]);

  // --- Delete individual question ---
  const handleDeleteQuestion = useCallback(async (id) => {
    await deleteQuestion(id);
  }, []);

  // --- Save all as Markdown ---
  const handleSaveMarkdown = useCallback(() => {
    let md = `# Question Collect Report\n\n`;
    md += `> Generated: ${new Date().toLocaleString("ko-KR")}\n\n`;

    if (summary) {
      md += `## Summarized Questions\n\n${summary}\n\n`;
    }
    if (generated) {
      md += `## Generated Questions\n\n${generated}\n\n`;
    }
    md += `## Submitted Questions (${questions.length})\n\n`;
    if (questions.length > 0) {
      questions.forEach((q, i) => {
        const date = new Date(q.createdAt).toLocaleString("ko-KR");
        md += `${i + 1}. ${q.text}  \n   _${date}_\n\n`;
      });
    } else {
      md += `None\n\n`;
    }

    const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `question-collect-${new Date().toISOString().slice(0, 10)}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }, [summary, generated, questions]);

  return (
    <main className="section py-5">
      <Container style={{ maxWidth: 900 }}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="mb-0">Question Admin</h4>
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={handleSaveMarkdown}
          >
            Save All as MD
          </Button>
        </div>

        {/* Gemini API Key */}
        <Card className="shadow-sm mb-4">
          <Card.Body className="py-2">
            <InputGroup size="sm">
              <InputGroup.Text>Gemini API Key</InputGroup.Text>
              <Form.Control
                type="password"
                placeholder="Enter your Gemini API key..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
            </InputGroup>
          </Card.Body>
        </Card>

        {error && (
          <Alert variant="danger" dismissible onClose={() => setError("")}>
            {error}
          </Alert>
        )}

        <Row>
          {/* --- Summarize section --- */}
          <Col lg={6} className="mb-4">
            <Card className="shadow-sm h-100 border-primary">
              <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
                <strong>Summarize Questions</strong>
                <Button
                  variant="outline-light"
                  size="sm"
                  onClick={handleResetSummary}
                >
                  Reset
                </Button>
              </Card.Header>
              <Card.Body>
                <p className="small text-muted mb-2">
                  Extract key questions from {questions.length} submitted
                  question(s) using Gemini AI.
                </p>
                <InputGroup className="mb-3" size="sm">
                  <InputGroup.Text>Count</InputGroup.Text>
                  <Form.Control
                    type="number"
                    min={1}
                    value={summaryCount}
                    onChange={(e) =>
                      setSummaryCount(
                        Math.max(1, Number(e.target.value) || 1)
                      )
                    }
                    style={{ maxWidth: 80 }}
                  />
                  <Button
                    variant="primary"
                    onClick={handleSummarize}
                    disabled={
                      questions.length === 0 || loading === "summary"
                    }
                  >
                    {loading === "summary" ? (
                      <>
                        <Spinner size="sm" className="me-1" /> Summarizing...
                      </>
                    ) : (
                      "Summarize"
                    )}
                  </Button>
                </InputGroup>
                {summary ? (
                  <pre
                    className="mb-0 p-2 border rounded bg-light"
                    style={{
                      whiteSpace: "pre-wrap",
                      fontFamily: "inherit",
                    }}
                  >
                    {summary}
                  </pre>
                ) : (
                  <p className="text-muted small mb-0">
                    No summarized questions yet.
                  </p>
                )}
              </Card.Body>
            </Card>
          </Col>

          {/* --- Generate section --- */}
          <Col lg={6} className="mb-4">
            <Card className="shadow-sm h-100 border-success">
              <Card.Header className="bg-success text-white d-flex justify-content-between align-items-center">
                <strong>Generate Questions</strong>
                <Button
                  variant="outline-light"
                  size="sm"
                  onClick={handleResetGenerated}
                >
                  Reset
                </Button>
              </Card.Header>
              <Card.Body>
                <p className="small text-muted mb-2">
                  Enter conversation content and generate questions using
                  Gemini AI.
                </p>
                <Form.Control
                  as="textarea"
                  rows={4}
                  placeholder="Paste conversation content here..."
                  value={conversationContent}
                  onChange={(e) => setConversationContent(e.target.value)}
                  className="mb-2"
                />
                <Form.Control
                  type="text"
                  placeholder="Generation prompt (optional)"
                  value={generationPrompt}
                  onChange={(e) => setGenerationPrompt(e.target.value)}
                  className="mb-2"
                />
                <Button
                  variant="success"
                  size="sm"
                  onClick={handleGenerate}
                  disabled={
                    !conversationContent.trim() || loading === "generate"
                  }
                >
                  {loading === "generate" ? (
                    <>
                      <Spinner size="sm" className="me-1" /> Generating...
                    </>
                  ) : (
                    "Generate"
                  )}
                </Button>
                {generated && (
                  <pre
                    className="mt-3 mb-0 p-2 border rounded bg-light"
                    style={{
                      whiteSpace: "pre-wrap",
                      fontFamily: "inherit",
                    }}
                  >
                    {generated}
                  </pre>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* --- Registered questions --- */}
        <Card className="shadow-sm">
          <Card.Header className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center gap-2">
              <strong>Submitted Questions</strong>
              <Badge bg="secondary">{questions.length}</Badge>
            </div>
            <Button
              variant="outline-danger"
              size="sm"
              onClick={handleResetQuestions}
              disabled={questions.length === 0}
            >
              Reset
            </Button>
          </Card.Header>
          <Card.Body>
            {questions.length === 0 ? (
              <p className="text-muted small mb-0">
                No questions submitted yet.
              </p>
            ) : (
              questions.map((q) => (
                <div
                  key={q.id}
                  className="d-flex justify-content-between align-items-start border-bottom py-2"
                >
                  <div>
                    <span style={{ whiteSpace: "pre-wrap" }}>{q.text}</span>
                    <br />
                    <small className="text-muted">
                      {new Date(q.createdAt).toLocaleString("ko-KR")}
                    </small>
                  </div>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    className="ms-2"
                    onClick={() => handleDeleteQuestion(q.id)}
                    style={{ flexShrink: 0 }}
                  >
                    Delete
                  </Button>
                </div>
              ))
            )}
          </Card.Body>
        </Card>
      </Container>
      <ScrollToTopButton />
    </main>
  );
};

export default QuestionAdmin;
