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
} from "react-bootstrap";
import ScrollToTopButton from "../components/ScrollToTopButton";
import { updateTitle } from "../utils";
import { siteName } from "../config";

const STORAGE_KEY_QUESTIONS = "qc_questions";
const STORAGE_KEY_SUMMARY = "qc_summary";
const STORAGE_KEY_GENERATED = "qc_generated";

const loadFromStorage = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const QuestionAdmin = () => {
  const [questions, setQuestions] = useState(() =>
    loadFromStorage(STORAGE_KEY_QUESTIONS, [])
  );
  const [summary, setSummary] = useState(() =>
    loadFromStorage(STORAGE_KEY_SUMMARY, "")
  );
  const [generated, setGenerated] = useState(() =>
    loadFromStorage(STORAGE_KEY_GENERATED, "")
  );

  const [summaryCount, setSummaryCount] = useState(3);
  const [conversationContent, setConversationContent] = useState("");
  const [generationPrompt, setGenerationPrompt] = useState("");

  useEffect(() => {
    updateTitle(`Question Admin | ${siteName}`);
  }, []);

  // Sync with storage changes from /qc page
  useEffect(() => {
    const handler = (e) => {
      if (e.key === STORAGE_KEY_QUESTIONS) {
        setQuestions(e.newValue ? JSON.parse(e.newValue) : []);
      } else if (e.key === STORAGE_KEY_SUMMARY) {
        setSummary(e.newValue || "");
      } else if (e.key === STORAGE_KEY_GENERATED) {
        setGenerated(e.newValue || "");
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  // --- Summarize questions ---
  const handleSummarize = useCallback(() => {
    if (questions.length === 0) return;
    const count = Math.max(1, Math.min(summaryCount, questions.length));
    // Simple extraction: pick the most recent N questions as key questions
    const selected = questions.slice(0, count);
    const text = selected
      .map((q, i) => `${i + 1}. ${q.text}`)
      .join("\n");
    setSummary(text);
    localStorage.setItem(STORAGE_KEY_SUMMARY, JSON.stringify(text));
  }, [questions, summaryCount]);

  // --- Generate questions from conversation ---
  const handleGenerate = useCallback(() => {
    const content = conversationContent.trim();
    if (!content) return;
    // Extract sentences that end with ? as candidate questions
    const lines = content.split(/\n+/).filter((l) => l.trim());
    const prompt = generationPrompt.trim();
    const header = prompt
      ? `[프롬프트: ${prompt}]\n\n`
      : "";
    // Simple heuristic: extract question-like sentences or generate numbered list
    const questionLines = lines.filter(
      (l) => l.trim().endsWith("?") || l.trim().endsWith("?")
    );
    let result;
    if (questionLines.length > 0) {
      result =
        header +
        questionLines.map((q, i) => `${i + 1}. ${q.trim()}`).join("\n");
    } else {
      // If no question marks found, create questions from each line
      result =
        header +
        lines.map((l, i) => `${i + 1}. ${l.trim()}`).join("\n");
    }
    setGenerated(result);
    localStorage.setItem(STORAGE_KEY_GENERATED, JSON.stringify(result));
  }, [conversationContent, generationPrompt]);

  // --- Reset handlers ---
  const handleResetSummary = useCallback(() => {
    setSummary("");
    localStorage.setItem(STORAGE_KEY_SUMMARY, JSON.stringify(""));
  }, []);

  const handleResetGenerated = useCallback(() => {
    setGenerated("");
    localStorage.setItem(STORAGE_KEY_GENERATED, JSON.stringify(""));
  }, []);

  const handleResetQuestions = useCallback(() => {
    setQuestions([]);
    localStorage.setItem(STORAGE_KEY_QUESTIONS, JSON.stringify([]));
  }, []);

  // --- Delete individual question ---
  const handleDeleteQuestion = useCallback(
    (id) => {
      const updated = questions.filter((q) => q.id !== id);
      setQuestions(updated);
      localStorage.setItem(STORAGE_KEY_QUESTIONS, JSON.stringify(updated));
    },
    [questions]
  );

  // --- Save all as Markdown ---
  const handleSaveMarkdown = useCallback(() => {
    let md = `# Question Collect Report\n\n`;
    md += `> Generated: ${new Date().toLocaleString("ko-KR")}\n\n`;

    if (summary) {
      md += `## 요약된 질문\n\n${summary}\n\n`;
    }
    if (generated) {
      md += `## 생성된 질문\n\n${generated}\n\n`;
    }
    md += `## 등록된 질문 (${questions.length}건)\n\n`;
    if (questions.length > 0) {
      questions.forEach((q, i) => {
        const date = new Date(q.createdAt).toLocaleString("ko-KR");
        md += `${i + 1}. ${q.text}  \n   _${date}_\n\n`;
      });
    } else {
      md += `없음\n\n`;
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
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="mb-0">Question Admin</h4>
          <Button variant="outline-secondary" size="sm" onClick={handleSaveMarkdown}>
            전체 MD 저장
          </Button>
        </div>

        <Row>
          {/* --- Summarize section --- */}
          <Col lg={6} className="mb-4">
            <Card className="shadow-sm h-100 border-primary">
              <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
                <strong>질문 요약</strong>
                <Button
                  variant="outline-light"
                  size="sm"
                  onClick={handleResetSummary}
                >
                  초기화
                </Button>
              </Card.Header>
              <Card.Body>
                <p className="small text-muted mb-2">
                  등록된 질문({questions.length}건)에서 핵심 질문을 도출합니다.
                </p>
                <InputGroup className="mb-3" size="sm">
                  <InputGroup.Text>도출 개수</InputGroup.Text>
                  <Form.Control
                    type="number"
                    min={1}
                    value={summaryCount}
                    onChange={(e) =>
                      setSummaryCount(Math.max(1, Number(e.target.value) || 1))
                    }
                    style={{ maxWidth: 80 }}
                  />
                  <Button
                    variant="primary"
                    onClick={handleSummarize}
                    disabled={questions.length === 0}
                  >
                    요약 실행
                  </Button>
                </InputGroup>
                {summary ? (
                  <pre
                    className="mb-0 p-2 border rounded bg-light"
                    style={{ whiteSpace: "pre-wrap", fontFamily: "inherit" }}
                  >
                    {summary}
                  </pre>
                ) : (
                  <p className="text-muted small mb-0">요약된 질문이 없습니다.</p>
                )}
              </Card.Body>
            </Card>
          </Col>

          {/* --- Generate section --- */}
          <Col lg={6} className="mb-4">
            <Card className="shadow-sm h-100 border-success">
              <Card.Header className="bg-success text-white d-flex justify-content-between align-items-center">
                <strong>질문 생성</strong>
                <Button
                  variant="outline-light"
                  size="sm"
                  onClick={handleResetGenerated}
                >
                  초기화
                </Button>
              </Card.Header>
              <Card.Body>
                <p className="small text-muted mb-2">
                  대화 내용을 입력하고, 질문을 생성합니다.
                </p>
                <Form.Control
                  as="textarea"
                  rows={4}
                  placeholder="대화 내용을 입력하세요..."
                  value={conversationContent}
                  onChange={(e) => setConversationContent(e.target.value)}
                  className="mb-2"
                />
                <Form.Control
                  type="text"
                  placeholder="질문 생성 프롬프트 (선택)"
                  value={generationPrompt}
                  onChange={(e) => setGenerationPrompt(e.target.value)}
                  className="mb-2"
                />
                <Button
                  variant="success"
                  size="sm"
                  onClick={handleGenerate}
                  disabled={!conversationContent.trim()}
                >
                  질문 생성
                </Button>
                {generated && (
                  <pre
                    className="mt-3 mb-0 p-2 border rounded bg-light"
                    style={{ whiteSpace: "pre-wrap", fontFamily: "inherit" }}
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
              <strong>등록된 질문</strong>
              <Badge bg="secondary">{questions.length}</Badge>
            </div>
            <Button
              variant="outline-danger"
              size="sm"
              onClick={handleResetQuestions}
              disabled={questions.length === 0}
            >
              초기화
            </Button>
          </Card.Header>
          <Card.Body>
            {questions.length === 0 ? (
              <p className="text-muted small mb-0">
                아직 등록된 질문이 없습니다.
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
                    삭제
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
