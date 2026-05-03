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

const GEMINI_API_KEY =
  process.env.REACT_APP_GEMINI_API_KEY || "";

const callGemini = async (prompt) => {
  if (!GEMINI_API_KEY) throw new Error("Gemini API key is not configured.");
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-pro-preview:generateContent?key=${GEMINI_API_KEY}`;
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

  // Editable drafts (local text before saving)
  const [summaryDraft, setSummaryDraft] = useState("");
  const [generatedDraft, setGeneratedDraft] = useState("");

  const [summaryCount, setSummaryCount] = useState(3);
  const [generateCount, setGenerateCount] = useState(3);
  const [conversationContent, setConversationContent] = useState("");
  const [generationPrompt, setGenerationPrompt] = useState("");
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    updateTitle(`Question Admin | ${siteName}`);
  }, []);

  // Real-time subscription to questions
  useEffect(() => {
    const unsub = subscribeQuestions((data) => setQuestions(data));
    return () => unsub();
  }, []);

  // Real-time subscription to meta (summary & generated)
  useEffect(() => {
    const unsub = subscribeMeta((data) => {
      const s = data.summary || "";
      const g = data.generated || "";
      setSummary(s);
      setGenerated(g);
      setSummaryDraft(s);
      setGeneratedDraft(g);
    });
    return () => unsub();
  }, []);

  // --- Summarize questions via Gemini ---
  const handleSummarize = useCallback(async () => {
    if (questions.length === 0) return;
    setError("");
    setLoading("summary");
    try {
      const questionList = questions
        .map((q, i) => `${i + 1}. ${q.text}`)
        .join("\n");
      const prompt = `Below is a list of questions submitted by an audience. Analyze ALL questions holistically — identify common themes, recurring concerns, and underlying interests across the entire set. Then synthesize exactly ${summaryCount} comprehensive, integrated questions that capture the essence of what the audience collectively wants to know. Do NOT simply pick or copy existing questions. Instead, create new unified questions that merge and represent multiple related questions together. Output only the synthesized questions, one per line (less than 15 words each), without numbering, in the same language as the originals.\n\nQuestions:\n${questionList}`;
      const result = await callGemini(prompt);
      const trimmed = result.trim();
      setSummaryDraft(trimmed);
      setSummary(trimmed);
      await updateMeta({ summary: trimmed });
    } catch (err) {
      setError(`Summary failed: ${err.message}`);
    } finally {
      setLoading(null);
    }
  }, [questions, summaryCount]);

  // --- Generate questions from conversation via Gemini ---
  const handleGenerate = useCallback(async () => {
    const content = conversationContent.trim();
    if (!content) return;
    setError("");
    setLoading("generate");
    try {
      const userPrompt = generationPrompt.trim();
      const prompt = userPrompt
        ? `${userPrompt}\n\nBased on the following conversation content, generate exactly ${generateCount} relevant questions. Output only the questions, one per line (less than 15 words each), without numbering, in the same language as the conversation.\n\nConversation:\n${content}`
        : `Based on the following conversation content, generate exactly ${generateCount} insightful questions that the audience might want to ask. Output only the questions, one per line (less than 15 words each), without numbering, in the same language as the conversation.\n\nConversation:\n${content}`;
      const result = await callGemini(prompt);
      const trimmed = result.trim();
      setGeneratedDraft(trimmed);
      setGenerated(trimmed);
      await updateMeta({ generated: trimmed });
    } catch (err) {
      setError(`Generation failed: ${err.message}`);
    } finally {
      setLoading(null);
    }
  }, [conversationContent, generationPrompt, generateCount]);

  // --- Manual update handlers ---
  const handleUpdateSummary = useCallback(async () => {
    const val = summaryDraft.trim();
    setSummary(val);
    await updateMeta({ summary: val });
  }, [summaryDraft]);

  const handleUpdateGenerated = useCallback(async () => {
    const val = generatedDraft.trim();
    setGenerated(val);
    await updateMeta({ generated: val });
  }, [generatedDraft]);

  // --- Reset handlers ---
  const handleResetSummary = useCallback(async () => {
    setSummary("");
    setSummaryDraft("");
    await updateMeta({ summary: "" });
  }, []);

  const handleResetGenerated = useCallback(async () => {
    setGenerated("");
    setGeneratedDraft("");
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

  // --- Copy questions ---
  const handleCopyQuestions = useCallback(async () => {
    if (questions.length === 0) return;
    const text = questions.map((q) => q.text).join("\n");
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  }, [questions]);

  // --- Save all as Markdown ---
  const handleSaveMarkdown = useCallback(() => {
    let md = `# Question Board Report\n\n`;
    md += `> Generated: ${new Date().toLocaleString("ko-KR")}\n\n`;

    if (summary) {
      md += `## Questions summarized from the collected questions\n\n${summary}\n\n`;
    }
    if (generated) {
      md += `## Questions suggested by AI Agent\n\n${generated}\n\n`;
    }
    md += `## Questions collected from the audience (${questions.length})\n\n`;
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
    a.download = `question-board-${new Date().toISOString().slice(0, 10)}.md`;
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

        {!GEMINI_API_KEY && (
          <Alert variant="warning">
            Gemini API key is not configured. Set <code>REACT_APP_GEMINI_API_KEY</code> in environment.
          </Alert>
        )}

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
                <strong>Questions summarized from the collected questions</strong>
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
                  question(s) using Gemini AI, or edit manually.
                </p>
                <InputGroup className="mb-2" size="sm">
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
                      questions.length === 0 ||
                      loading === "summary" ||
                      !GEMINI_API_KEY
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
                <Form.Control
                  as="textarea"
                  rows={5}
                  placeholder="Summarized questions (one per line with less than 15 words each)..."
                  value={summaryDraft}
                  onChange={(e) => setSummaryDraft(e.target.value)}
                  className="mb-2"
                  style={{ fontSize: "0.85rem" }}
                />
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={handleUpdateSummary}
                  disabled={summaryDraft.trim() === summary}
                >
                  Update
                </Button>
              </Card.Body>
            </Card>
          </Col>

          {/* --- Generate section --- */}
          <Col lg={6} className="mb-4">
            <Card className="shadow-sm h-100 border-success">
              <Card.Header className="bg-success text-white d-flex justify-content-between align-items-center">
                <strong>Questions suggested by AI Agent</strong>
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
                  Generate from conversation or edit manually.
                </p>
                <Form.Control
                  as="textarea"
                  rows={3}
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
                  size="sm"
                />
                <InputGroup className="mb-3" size="sm">
                  <InputGroup.Text>Count</InputGroup.Text>
                  <Form.Control
                    type="number"
                    min={1}
                    value={generateCount}
                    onChange={(e) =>
                      setGenerateCount(
                        Math.max(1, Number(e.target.value) || 1)
                      )
                    }
                    style={{ maxWidth: 80 }}
                  />
                  <Button
                    variant="success"
                    onClick={handleGenerate}
                    disabled={
                      !conversationContent.trim() ||
                      loading === "generate" ||
                      !GEMINI_API_KEY
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
                </InputGroup>
                <Form.Control
                  as="textarea"
                  rows={5}
                  placeholder="Generated questions (one per line with less than 15 words each)..."
                  value={generatedDraft}
                  onChange={(e) => setGeneratedDraft(e.target.value)}
                  className="mb-2"
                  style={{ fontSize: "0.85rem" }}
                />
                <Button
                  variant="outline-success"
                  size="sm"
                  onClick={handleUpdateGenerated}
                  disabled={generatedDraft.trim() === generated}
                >
                  Update
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* --- Submitted questions --- */}
        <Card className="shadow-sm">
          <Card.Header className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center gap-2">
              <strong>Questions collected from the audience</strong>
              <Badge bg="secondary">{questions.length}</Badge>
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={handleCopyQuestions}
                disabled={questions.length === 0}
              >
                {copied ? "Copied!" : "Copy"}
              </Button>
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
