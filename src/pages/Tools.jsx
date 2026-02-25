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

/** Data URL의 base64를 바이트 배열로 변환 */
const dataUrlToBytes = (dataUrl) => {
  const base64 = dataUrl.split(",")[1];
  if (!base64) return new Uint8Array(0);
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
};

/** 16×16, 32×32 PNG 데이터 URL로 favicon.ico 바이너리 생성 (ICO는 내부에 PNG 포함 가능) */
const buildIcoBlob = (png16DataUrl, png32DataUrl) => {
  const png16 = dataUrlToBytes(png16DataUrl);
  const png32 = dataUrlToBytes(png32DataUrl);
  const headerSize = 6;
  const entrySize = 16;
  const numImages = 2;
  const offsetFirst = headerSize + entrySize * numImages;
  const offset32 = offsetFirst + png16.length;
  const totalSize = offset32 + png32.length;
  const buf = new ArrayBuffer(totalSize);
  const view = new DataView(buf);
  let off = 0;
  view.setUint16(off, 0, true); off += 2;
  view.setUint16(off, 1, true); off += 2; // type 1 = ICO
  view.setUint16(off, numImages, true); off += 2;
  const writeEntry = (width, height, size, offset) => {
    view.setUint8(off, width); off += 1;
    view.setUint8(off, height); off += 1;
    view.setUint8(off, 0); off += 1;
    view.setUint8(off, 0); off += 1;
    view.setUint16(off, 1, true); off += 2;
    view.setUint16(off, 32, true); off += 2;
    view.setUint32(off, size, true); off += 4;
    view.setUint32(off, offset, true); off += 4;
  };
  writeEntry(16, 16, png16.length, offsetFirst);
  writeEntry(32, 32, png32.length, offset32);
  new Uint8Array(buf).set(png16, offsetFirst);
  new Uint8Array(buf).set(png32, offset32);
  return new Blob([buf], { type: "image/x-icon" });
};

const TOOL_SECTIONS = [
  { id: "tool-capitalize", label: "Capitalize" },
  { id: "tool-lowercase", label: "모두 소문자화" },
  { id: "tool-qr", label: "QR 코드 생성" },
  { id: "tool-favicon", label: "Favicon 생성" },
];

const Tools = () => {
  const [capitalizeInput, setCapitalizeInput] = useState("");
  const [capitalizeResult, setCapitalizeResult] = useState("");
  const [capitalizeCopied, setCapitalizeCopied] = useState(false);

  const [lowercaseInput, setLowercaseInput] = useState("");
  const [lowercaseResult, setLowercaseResult] = useState("");
  const [lowercaseCopied, setLowercaseCopied] = useState(false);

  const [qrUrl, setQrUrl] = useState("");
  const [qrDataUrl, setQrDataUrl] = useState(null);
  const [qrError, setQrError] = useState(null);
  const [qrCopied, setQrCopied] = useState(false);

  const [faviconPreview, setFaviconPreview] = useState(null);
  const [favicon16, setFavicon16] = useState(null);
  const [favicon32, setFavicon32] = useState(null);
  const [faviconError, setFaviconError] = useState(null);

  const sectionCapitalizeRef = useRef(null);
  const sectionLowercaseRef = useRef(null);
  const sectionQrRef = useRef(null);
  const sectionFaviconRef = useRef(null);
  const inputCapitalizeRef = useRef(null);
  const inputLowercaseRef = useRef(null);
  const inputQrRef = useRef(null);
  const inputFaviconRef = useRef(null);

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

  useEffect(() => {
    setLowercaseResult(
      typeof lowercaseInput === "string" ? lowercaseInput.toLowerCase() : ""
    );
  }, [lowercaseInput]);

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

  const handleLowercaseCopy = useCallback(async () => {
    if (!lowercaseResult) return;
    try {
      await navigator.clipboard.writeText(lowercaseResult);
      setLowercaseCopied(true);
      setTimeout(() => setLowercaseCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  }, [lowercaseResult]);

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

  const generateFaviconFromImage = useCallback((file) => {
    if (!file || !file.type.startsWith("image/")) {
      setFaviconError("이미지 파일을 선택해 주세요.");
      setFavicon16(null);
      setFavicon32(null);
      setFaviconPreview(null);
      return;
    }
    setFaviconError(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      const url = e.target?.result;
      setFaviconPreview(url);
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        try {
          const w = img.naturalWidth || img.width;
          const h = img.naturalHeight || img.height;
          const cropSize = Math.min(w, h);
          const srcX = (w - cropSize) / 2;
          const srcY = (h - cropSize) / 2;
          const sizes = [16, 32];
          const dataUrls = {};
          sizes.forEach((size) => {
            const canvas = document.createElement("canvas");
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, srcX, srcY, cropSize, cropSize, 0, 0, size, size);
            dataUrls[size] = canvas.toDataURL("image/png");
          });
          setFavicon16(dataUrls[16]);
          setFavicon32(dataUrls[32]);
        } catch (err) {
          setFaviconError("Favicon 생성에 실패했습니다.");
          setFavicon16(null);
          setFavicon32(null);
        }
      };
      img.onerror = () => {
        setFaviconError("이미지를 불러올 수 없습니다.");
        setFavicon16(null);
        setFavicon32(null);
      };
      img.src = url;
    };
    reader.readAsDataURL(file);
  }, []);

  const handleFaviconFileChange = useCallback(
    (e) => {
      const file = e.target?.files?.[0];
      if (file) generateFaviconFromImage(file);
      else {
        setFaviconPreview(null);
        setFavicon16(null);
        setFavicon32(null);
        setFaviconError(null);
      }
    },
    [generateFaviconFromImage]
  );

  const downloadFaviconIco = useCallback(() => {
    if (!favicon16 || !favicon32) return;
    try {
      const blob = buildIcoBlob(favicon16, favicon32);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "favicon.ico";
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setFaviconError("favicon.ico 저장에 실패했습니다.");
    }
  }, [favicon16, favicon32]);

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
            onClick={() => scrollToSection(sectionLowercaseRef, inputLowercaseRef)}
          >
            모두 소문자화
          </Button>
          <Button
            variant="outline-primary"
            size="sm"
            onClick={() => scrollToSection(sectionQrRef, inputQrRef)}
          >
            QR 코드 생성
          </Button>
          <Button
            variant="outline-primary"
            size="sm"
            onClick={() => scrollToSection(sectionFaviconRef, inputFaviconRef)}
          >
            Favicon 생성
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

          <Col lg={6} className="mb-4" ref={sectionLowercaseRef}>
            <Card className="shadow-sm h-100" id={TOOL_SECTIONS[1].id}>
              <Card.Header as="h5" className="bg-light">
                모두 소문자화
              </Card.Header>
              <Card.Body>
                <p className="small text-muted mb-2">
                  문장을 입력하면 전체를 소문자로 바꾼 결과를 보여줍니다. (Capitalize의 반대)
                </p>
                <Form.Control
                  ref={inputLowercaseRef}
                  as="textarea"
                  rows={2}
                  placeholder="입력할 문장..."
                  value={lowercaseInput}
                  onChange={(e) => setLowercaseInput(e.target.value)}
                  className="mb-3"
                />
                {lowercaseResult && (
                  <>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      readOnly
                      value={lowercaseResult}
                      className="mb-2 bg-light"
                    />
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={handleLowercaseCopy}
                    >
                      {lowercaseCopied ? "복사됨" : "복사"}
                    </Button>
                  </>
                )}
              </Card.Body>
            </Card>
          </Col>

          <Col lg={6} className="mb-4" ref={sectionQrRef}>
            <Card className="shadow-sm h-100" id={TOOL_SECTIONS[2].id}>
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

          <Col lg={6} className="mb-4" ref={sectionFaviconRef}>
            <Card className="shadow-sm h-100" id={TOOL_SECTIONS[3].id}>
              <Card.Header as="h5" className="bg-light">
                Favicon 생성
              </Card.Header>
              <Card.Body>
                <p className="small text-muted mb-2">
                  이미지를 올리면 16×16, 32×32가 포함된 favicon.ico 파일을 만들어 다운로드할 수 있습니다.
                </p>
                <Form.Control
                  ref={inputFaviconRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFaviconFileChange}
                  className="mb-3"
                />
                {faviconError && (
                  <div className="small text-danger mb-2">{faviconError}</div>
                )}
                {faviconPreview && (
                  <div className="mb-3">
                    <span className="small text-muted d-block mb-1">미리보기</span>
                    <img
                      src={faviconPreview}
                      alt="업로드 미리보기"
                      style={{ maxWidth: "120px", maxHeight: "120px", objectFit: "contain" }}
                      className="d-block border rounded"
                    />
                  </div>
                )}
                {favicon16 && favicon32 && (
                  <div className="d-flex flex-wrap gap-2 align-items-center">
                    <img src={favicon16} alt="16x16" width={16} height={16} className="border" />
                    <img src={favicon32} alt="32x32" width={32} height={32} className="border" />
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={downloadFaviconIco}
                    >
                      favicon.ico 저장
                    </Button>
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
