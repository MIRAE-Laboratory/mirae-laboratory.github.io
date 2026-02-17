import React, { useState, useCallback, useEffect, useRef } from "react";
import { Container, Card, Form, Button, Row, Col } from "react-bootstrap";
import QRCode from "qrcode";
import ScrollToTopButton from "../components/ScrollToTopButton";
import { updateTitle } from "../utils";
import { siteName } from "../config";

const capitalizeWords = (text) => {
  if (!text || typeof text !== "string") return "";
  return text
    .trim()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const TOOL_SECTIONS = [
  { id: "tool-capitalize", label: "Capitalize" },
  { id: "tool-qr", label: "QR 코드 생성" },
];

const Tools = () => {
  const [capitalizeInput, setCapitalizeInput] = useState("");
  const [capitalizeResult, setCapitalizeResult] = useState("");
  const [capitalizeCopied, setCapitalizeCopied] = useState(false);

  const [qrUrl, setQrUrl] = useState("");
  const [qrDataUrl, setQrDataUrl] = useState(null);
  const [qrError, setQrError] = useState(null);
  const [qrCopied, setQrCopied] = useState(false);

  const sectionCapitalizeRef = useRef(null);
  const sectionQrRef = useRef(null);
  const inputCapitalizeRef = useRef(null);
  const inputQrRef = useRef(null);

  const scrollToSection = useCallback((sectionRef, inputRef) => {
    sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    setTimeout(() => inputRef.current?.focus(), 350);
  }, []);

  useEffect(() => {
    updateTitle(`Tools | ${siteName}`);
  }, []);

  useEffect(() => {
    setCapitalizeResult(capitalizeWords(capitalizeInput));
  }, [capitalizeInput]);

  const handleCapitalizeCopy = useCallback(async () => {
    if (!capitalizeResult) return;
    try {
      await navigator.clipboard.writeText(capitalizeResult);
      setCapitalizeCopied(true);
      setTimeout(() => setCapitalizeCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  }, [capitalizeResult]);

  const generateQr = useCallback(async () => {
    const url = (qrUrl || "").trim();
    if (!url) {
      setQrError("주소를 입력하세요.");
      setQrDataUrl(null);
      return;
    }
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      setQrError("http:// 또는 https:// 로 시작하는 주소를 입력하세요.");
      setQrDataUrl(null);
      return;
    }
    setQrError(null);
    try {
      const dataUrl = await QRCode.toDataURL(url, { width: 256, margin: 2 });
      setQrDataUrl(dataUrl);
    } catch (err) {
      setQrError("QR 코드 생성에 실패했습니다.");
      setQrDataUrl(null);
    }
  }, [qrUrl]);

  const handleQrCopy = useCallback(async () => {
    if (!qrDataUrl) return;
    try {
      const blob = await (await fetch(qrDataUrl)).blob();
      await navigator.clipboard.write([new window.ClipboardItem({ "image/png": blob })]);
      setQrCopied(true);
      setTimeout(() => setQrCopied(false), 2000);
    } catch (err) {
      console.error("Copy image failed:", err);
    }
  }, [qrDataUrl]);

  const handleQrSave = useCallback(() => {
    if (!qrDataUrl) return;
    const a = document.createElement("a");
    a.href = qrDataUrl;
    a.download = "qrcode.png";
    a.click();
  }, [qrDataUrl]);

  return (
    <main className="section py-5">
      <Container>
        <div className="mb-4 d-flex flex-wrap gap-2 align-items-center">
          <span className="small text-muted me-1">Tools:</span>
          <Button
            variant="outline-primary"
            size="sm"
            onClick={() => scrollToSection(sectionCapitalizeRef, inputCapitalizeRef)}
          >
            Capitalize
          </Button>
          <Button
            variant="outline-primary"
            size="sm"
            onClick={() => scrollToSection(sectionQrRef, inputQrRef)}
          >
            QR 코드 생성
          </Button>
        </div>

        <Row>
          <Col lg={6} className="mb-4" ref={sectionCapitalizeRef}>
            <Card className="shadow-sm h-100" id={TOOL_SECTIONS[0].id}>
              <Card.Header as="h5" className="bg-light">
                Capitalize
              </Card.Header>
              <Card.Body>
                <p className="small text-muted mb-2">
                  문장을 입력하면 단어 단위로 첫 글자를 대문자로 바꾼 결과를 보여줍니다.
                </p>
                <Form.Control
                  ref={inputCapitalizeRef}
                  as="textarea"
                  rows={2}
                  placeholder="입력할 문장..."
                  value={capitalizeInput}
                  onChange={(e) => setCapitalizeInput(e.target.value)}
                  className="mb-3"
                />
                {capitalizeResult && (
                  <>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      readOnly
                      value={capitalizeResult}
                      className="mb-2 bg-light"
                    />
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={handleCapitalizeCopy}
                    >
                      {capitalizeCopied ? "복사됨" : "복사"}
                    </Button>
                  </>
                )}
              </Card.Body>
            </Card>
          </Col>

          <Col lg={6} className="mb-4" ref={sectionQrRef}>
            <Card className="shadow-sm h-100" id={TOOL_SECTIONS[1].id}>
              <Card.Header as="h5" className="bg-light">
                QR 코드 생성
              </Card.Header>
              <Card.Body>
                <p className="small text-muted mb-2">
                  주소를 입력하고 생성 버튼을 누르면 QR 코드 이미지를 만들 수 있습니다.
                </p>
                <Form.Control
                  ref={inputQrRef}
                  type="url"
                  placeholder="https://example.com"
                  value={qrUrl}
                  onChange={(e) => setQrUrl(e.target.value)}
                  className="mb-2"
                />
                <Button variant="primary" size="sm" onClick={generateQr} className="mb-3">
                  QR 코드 생성
                </Button>
                {qrError && (
                  <div className="small text-danger mb-2">{qrError}</div>
                )}
                {qrDataUrl && (
                  <div className="mb-2">
                    <img
                      src={qrDataUrl}
                      alt="QR Code"
                      style={{ maxWidth: "256px", height: "auto" }}
                      className="d-block mb-2 border"
                    />
                    <div className="d-flex gap-2">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={handleQrCopy}
                      >
                        {qrCopied ? "복사됨" : "복사"}
                      </Button>
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={handleQrSave}
                      >
                        저장
                      </Button>
                    </div>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      <ScrollToTopButton />
    </main>
  );
};

export default Tools;
