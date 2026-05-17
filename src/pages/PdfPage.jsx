import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Container,
  Row,
  Col,
  Tab,
  Nav,
  Button,
  Form,
  Card,
  Alert,
  Spinner,
  Badge,
} from "react-bootstrap";
import { PDFDocument, rgb } from "pdf-lib";
import * as pdfjsLib from "pdfjs-dist";
import SignaturePad from "signature_pad";
import ScrollToTopButton from "../components/ScrollToTopButton";
import { updateTitle } from "../utils";
import { siteName } from "../config";

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`;

const downloadPdf = (bytes, name) => {
  const blob = new Blob([bytes], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const a = Object.assign(document.createElement("a"), {
    href: url,
    download: name,
  });
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

// ── FileDropZone ────────────────────────────────────────────────────────────
const FileDropZone = ({ onFile }) => {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef(null);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file?.type === "application/pdf") onFile(file);
  };

  return (
    <div
      onClick={() => inputRef.current.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      className={`rounded-3 p-5 text-center mb-4 ${
        dragging ? "bg-primary bg-opacity-10" : ""
      }`}
      style={{
        cursor: "pointer",
        border: "2px dashed",
        borderColor: dragging ? "var(--bs-primary)" : "var(--bs-secondary)",
      }}
    >
      <div className="fs-1 mb-2">📄</div>
      <div className="fw-semibold">PDF 파일을 여기에 끌어다 놓거나 클릭하여 선택</div>
      <div className="text-muted small mt-1">모든 처리는 브라우저에서만 이루어집니다 (서버 미전송)</div>
      <input
        ref={inputRef}
        type="file"
        accept=".pdf"
        style={{ display: "none" }}
        onChange={(e) => e.target.files[0] && onFile(e.target.files[0])}
      />
    </div>
  );
};

// ── PdfViewer ───────────────────────────────────────────────────────────────
const PdfViewer = ({ pdfBytes }) => {
  const canvasRef = useRef(null);
  const renderTaskRef = useRef(null);
  const [pdfDoc, setPdfDoc] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [scale, setScale] = useState(1.5);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setCurrentPage(1);
    pdfjsLib
      .getDocument({ data: pdfBytes.slice() })
      .promise.then((doc) => {
        if (!cancelled) {
          setPdfDoc(doc);
          setTotalPages(doc.numPages);
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [pdfBytes]);

  useEffect(() => {
    if (!pdfDoc || !canvasRef.current) return;
    if (renderTaskRef.current) {
      renderTaskRef.current.cancel();
    }
    pdfDoc.getPage(currentPage).then((page) => {
      const viewport = page.getViewport({ scale });
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const task = page.render({
        canvasContext: canvas.getContext("2d"),
        viewport,
      });
      renderTaskRef.current = task;
      task.promise.catch(() => {});
    });
  }, [pdfDoc, currentPage, scale]);

  const changeScale = (delta) =>
    setScale((s) => Math.min(3, Math.max(0.5, parseFloat((s + delta).toFixed(2)))));

  return (
    <div>
      <div className="d-flex align-items-center gap-2 mb-3 flex-wrap">
        <Button
          size="sm"
          variant="outline-secondary"
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
        >
          ◀ 이전
        </Button>
        <span className="px-2">
          {currentPage} / {totalPages}
        </span>
        <Button
          size="sm"
          variant="outline-secondary"
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
        >
          다음 ▶
        </Button>
        <div className="ms-3 d-flex align-items-center gap-2">
          <Button
            size="sm"
            variant="outline-secondary"
            onClick={() => changeScale(-0.25)}
          >
            −
          </Button>
          <span style={{ minWidth: 52, textAlign: "center" }}>
            {Math.round(scale * 100)}%
          </span>
          <Button
            size="sm"
            variant="outline-secondary"
            onClick={() => changeScale(0.25)}
          >
            ＋
          </Button>
        </div>
      </div>
      {loading ? (
        <div className="text-center py-5">
          <Spinner />
        </div>
      ) : (
        <div
          style={{
            overflow: "auto",
            maxHeight: "75vh",
            border: "1px solid var(--bs-border-color)",
            borderRadius: 4,
          }}
        >
          <canvas ref={canvasRef} style={{ display: "block" }} />
        </div>
      )}
    </div>
  );
};

// ── PdfMerge ────────────────────────────────────────────────────────────────
const PdfMerge = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  const addFiles = async (fileList) => {
    const newFiles = await Promise.all(
      Array.from(fileList)
        .filter((f) => f.type === "application/pdf")
        .map(async (f) => ({
          name: f.name,
          bytes: new Uint8Array(await f.arrayBuffer()),
        }))
    );
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const removeFile = (i) =>
    setFiles((prev) => prev.filter((_, idx) => idx !== i));

  const move = (i, dir) => {
    const j = i + dir;
    if (j < 0 || j >= files.length) return;
    setFiles((prev) => {
      const arr = [...prev];
      [arr[i], arr[j]] = [arr[j], arr[i]];
      return arr;
    });
  };

  const merge = async () => {
    setLoading(true);
    try {
      const merged = await PDFDocument.create();
      for (const file of files) {
        const doc = await PDFDocument.load(file.bytes);
        const pages = await merged.copyPages(doc, doc.getPageIndices());
        pages.forEach((p) => merged.addPage(p));
      }
      downloadPdf(await merged.save(), "merged.pdf");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div
        className="rounded-3 p-4 text-center mb-3"
        style={{
          cursor: "pointer",
          border: "2px dashed var(--bs-secondary)",
        }}
        onClick={() => inputRef.current.click()}
      >
        <span>＋ PDF 파일 추가 (여러 개 선택 가능)</span>
        <input
          ref={inputRef}
          type="file"
          accept=".pdf"
          multiple
          style={{ display: "none" }}
          onChange={(e) => addFiles(e.target.files)}
        />
      </div>

      {files.length === 0 && (
        <p className="text-muted text-center">
          합칠 PDF 파일을 2개 이상 추가하세요
        </p>
      )}

      {files.length > 0 && (
        <>
          <div className="mb-3">
            {files.map((f, i) => (
              <div
                key={i}
                className="d-flex align-items-center gap-2 mb-2 p-2 border rounded"
              >
                <span className="text-muted me-1">{i + 1}.</span>
                <span className="flex-grow-1 text-truncate">{f.name}</span>
                <Button
                  size="sm"
                  variant="outline-secondary"
                  onClick={() => move(i, -1)}
                  disabled={i === 0}
                >
                  ↑
                </Button>
                <Button
                  size="sm"
                  variant="outline-secondary"
                  onClick={() => move(i, 1)}
                  disabled={i === files.length - 1}
                >
                  ↓
                </Button>
                <Button
                  size="sm"
                  variant="outline-danger"
                  onClick={() => removeFile(i)}
                >
                  ✕
                </Button>
              </div>
            ))}
          </div>
          <Button onClick={merge} disabled={files.length < 2 || loading}>
            {loading ? (
              <Spinner size="sm" className="me-2" />
            ) : null}
            {files.length}개 PDF 합치기 및 다운로드
          </Button>
          {files.length < 2 && (
            <div className="text-muted mt-2 small">
              최소 2개 파일이 필요합니다
            </div>
          )}
        </>
      )}
    </div>
  );
};

// ── PdfPageEditor ───────────────────────────────────────────────────────────
const PdfPageEditor = ({ pdfBytes }) => {
  const [thumbnails, setThumbnails] = useState([]);
  const [selected, setSelected] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setSelected(new Set());
    setThumbnails([]);

    const generate = async () => {
      const doc = await pdfjsLib
        .getDocument({ data: pdfBytes.slice() })
        .promise;
      for (let i = 1; i <= doc.numPages; i++) {
        if (cancelled) return;
        const page = await doc.getPage(i);
        const viewport = page.getViewport({ scale: 0.3 });
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        await page.render({
          canvasContext: canvas.getContext("2d"),
          viewport,
        }).promise;
        if (!cancelled)
          setThumbnails((prev) => [...prev, canvas.toDataURL()]);
      }
      if (!cancelled) setLoading(false);
    };

    generate();
    return () => {
      cancelled = true;
    };
  }, [pdfBytes]);

  const toggle = (i) =>
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });

  const deletePages = async () => {
    setProcessing(true);
    try {
      const doc = await PDFDocument.load(pdfBytes);
      Array.from(selected)
        .sort((a, b) => b - a)
        .forEach((i) => doc.removePage(i));
      downloadPdf(await doc.save(), "edited.pdf");
    } finally {
      setProcessing(false);
    }
  };

  const extractPages = async () => {
    setProcessing(true);
    try {
      const src = await PDFDocument.load(pdfBytes);
      const dest = await PDFDocument.create();
      const indices = Array.from(selected).sort((a, b) => a - b);
      const pages = await dest.copyPages(src, indices);
      pages.forEach((p) => dest.addPage(p));
      downloadPdf(await dest.save(), "extracted.pdf");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div>
      {loading && thumbnails.length === 0 && (
        <div className="text-center py-5">
          <Spinner className="me-2" />
          썸네일 생성 중...
        </div>
      )}
      {thumbnails.length > 0 && (
        <>
          <div className="mb-3 d-flex gap-2 flex-wrap align-items-center">
            <span className="text-muted me-2">
              {selected.size}개 선택됨 / 전체 {thumbnails.length}페이지
            </span>
            <Button
              size="sm"
              variant="outline-secondary"
              onClick={() =>
                setSelected(new Set(thumbnails.map((_, i) => i)))
              }
            >
              전체 선택
            </Button>
            <Button
              size="sm"
              variant="outline-secondary"
              onClick={() => setSelected(new Set())}
            >
              선택 해제
            </Button>
            <Button
              size="sm"
              variant="danger"
              onClick={deletePages}
              disabled={selected.size === 0 || processing}
            >
              {processing ? <Spinner size="sm" /> : "선택 페이지 삭제"}
            </Button>
            <Button
              size="sm"
              variant="primary"
              onClick={extractPages}
              disabled={selected.size === 0 || processing}
            >
              {processing ? <Spinner size="sm" /> : "선택 페이지 추출"}
            </Button>
          </div>
          <Row xs={3} sm={4} md={5} lg={6} className="g-2">
            {thumbnails.map((thumb, i) => (
              <Col key={i}>
                <Card
                  onClick={() => toggle(i)}
                  className={selected.has(i) ? "border-primary border-2" : ""}
                  style={{ cursor: "pointer", userSelect: "none" }}
                >
                  <Card.Img
                    variant="top"
                    src={thumb}
                    style={{ aspectRatio: "3/4", objectFit: "contain" }}
                  />
                  <Card.Footer className="text-center p-1 small">
                    {selected.has(i) ? "✓ " : ""}
                    {i + 1}
                  </Card.Footer>
                </Card>
              </Col>
            ))}
          </Row>
        </>
      )}
    </div>
  );
};

// ── PdfSigner ───────────────────────────────────────────────────────────────
const PdfSigner = ({ pdfBytes }) => {
  const padCanvasRef = useRef(null);
  const previewCanvasRef = useRef(null);
  const padRef = useRef(null);
  const [pdfJsDoc, setPdfJsDoc] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [signPos, setSignPos] = useState({ x: 50, y: 50, width: 200, height: 80 });
  const [processing, setProcessing] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);
  const [pendingBytes, setPendingBytes] = useState(null);
  const [previewStale, setPreviewStale] = useState(false);

  useEffect(() => {
    pdfjsLib
      .getDocument({ data: pdfBytes.slice() })
      .promise.then((doc) => {
        setPdfJsDoc(doc);
        setTotalPages(doc.numPages);
      });
  }, [pdfBytes]);

  // Render plain page (no signature) when page changes or on load
  useEffect(() => {
    if (!pdfJsDoc || !previewCanvasRef.current) return;
    setPendingBytes(null);
    setPreviewStale(false);
    pdfJsDoc.getPage(currentPage).then((page) => {
      const viewport = page.getViewport({ scale: 1.5 });
      const canvas = previewCanvasRef.current;
      if (!canvas) return;
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      page.render({ canvasContext: canvas.getContext("2d"), viewport });
    });
  }, [pdfJsDoc, currentPage]);

  useEffect(() => {
    if (!padCanvasRef.current) return;
    const canvas = padCanvasRef.current;
    canvas.width = canvas.offsetWidth || 400;
    canvas.height = 160;
    const pad = new SignaturePad(canvas, { penColor: "#000000" });
    padRef.current = pad;
    const onEnd = () => {
      setIsEmpty(pad.isEmpty());
      setPreviewStale(true);
      setPendingBytes(null);
    };
    canvas.addEventListener("pointerup", onEnd);
    return () => {
      canvas.removeEventListener("pointerup", onEnd);
      pad.off();
    };
  }, []);

  const clearPad = () => {
    padRef.current?.clear();
    setIsEmpty(true);
    setPendingBytes(null);
    // Re-render plain page
    if (pdfJsDoc && previewCanvasRef.current) {
      pdfJsDoc.getPage(currentPage).then((page) => {
        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = previewCanvasRef.current;
        if (!canvas) return;
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        page.render({ canvasContext: canvas.getContext("2d"), viewport });
      });
    }
  };

  const markStale = () => {
    setPreviewStale(true);
    setPendingBytes(null);
  };

  // Insert: render page + overlay signature, prepare PDF bytes
  const insertPreview = async () => {
    const pad = padRef.current;
    if (!pad || pad.isEmpty()) return;
    setProcessing(true);
    try {
      const sigDataUrl = pad.toDataURL("image/png");

      // Get PDF page dimensions (in points at scale 1)
      const pdfJsPage = await pdfJsDoc.getPage(currentPage);
      const baseViewport = pdfJsPage.getViewport({ scale: 1 });
      const pdfW = baseViewport.width;
      const pdfH = baseViewport.height;

      // Render page to preview canvas
      const renderScale = 1.5;
      const viewport = pdfJsPage.getViewport({ scale: renderScale });
      const canvas = previewCanvasRef.current;
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      await pdfJsPage.render({ canvasContext: canvas.getContext("2d"), viewport }).promise;

      // Overlay signature on canvas
      const scaleX = canvas.width / pdfW;
      const scaleY = canvas.height / pdfH;
      const sigImg = new Image();
      sigImg.src = sigDataUrl;
      await new Promise((resolve) => { sigImg.onload = resolve; });
      canvas.getContext("2d").drawImage(
        sigImg,
        signPos.x * scaleX,
        signPos.y * scaleY,
        signPos.width * scaleX,
        signPos.height * scaleY
      );

      // Build PDF bytes with embedded signature
      const base64 = sigDataUrl.split(",")[1];
      const pngBytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
      const doc = await PDFDocument.load(pdfBytes);
      const pngImage = await doc.embedPng(pngBytes);
      const page = doc.getPages()[currentPage - 1];
      const { height: pageHeight } = page.getSize();
      page.drawImage(pngImage, {
        x: signPos.x,
        y: pageHeight - signPos.y - signPos.height,
        width: signPos.width,
        height: signPos.height,
      });
      setPendingBytes(await doc.save());
      setPreviewStale(false);
    } finally {
      setProcessing(false);
    }
  };

  const posField = (key, label) => (
    <Form.Group key={key} className="mb-2 d-flex align-items-center gap-2">
      <Form.Label className="mb-0" style={{ minWidth: 70 }}>
        {label}
      </Form.Label>
      <Form.Control
        type="number"
        size="sm"
        value={signPos[key]}
        onChange={(e) => {
          setSignPos((prev) => ({ ...prev, [key]: +e.target.value }));
          markStale();
        }}
      />
    </Form.Group>
  );

  return (
    <Row className="g-4">
      <Col md={5}>
        <h6 className="mb-2">① 서명 입력</h6>
        <div
          className="border rounded mb-2"
          style={{ background: "#fff", lineHeight: 0 }}
        >
          <canvas
            ref={padCanvasRef}
            style={{ width: "100%", height: 160, touchAction: "none", display: "block" }}
          />
        </div>
        <Button
          size="sm"
          variant="outline-secondary"
          onClick={clearPad}
          className="mb-4"
        >
          지우기
        </Button>

        <h6 className="mb-2">② 삽입 페이지 선택</h6>
        <div className="d-flex align-items-center gap-2 mb-4">
          <Button
            size="sm"
            variant="outline-secondary"
            onClick={() => { setCurrentPage((p) => Math.max(1, p - 1)); markStale(); }}
            disabled={currentPage === 1}
          >
            ◀
          </Button>
          <Form.Control
            type="number"
            size="sm"
            value={currentPage}
            min={1}
            max={totalPages}
            style={{ width: 70, textAlign: "center" }}
            onChange={(e) => {
              setCurrentPage(Math.min(totalPages, Math.max(1, +e.target.value)));
              markStale();
            }}
          />
          <span className="text-muted">/ {totalPages}</span>
          <Button
            size="sm"
            variant="outline-secondary"
            onClick={() => { setCurrentPage((p) => Math.min(totalPages, p + 1)); markStale(); }}
            disabled={currentPage === totalPages}
          >
            ▶
          </Button>
        </div>

        <h6 className="mb-2">③ 서명 위치 (포인트 단위)</h6>
        {posField("x", "X (왼쪽에서)")}
        {posField("y", "Y (위에서)")}
        {posField("width", "너비")}
        {posField("height", "높이")}

        <div className="d-flex gap-2 mt-3">
          <Button
            onClick={insertPreview}
            disabled={isEmpty || processing}
            variant={previewStale && pendingBytes ? "warning" : "primary"}
          >
            {processing ? <Spinner size="sm" className="me-2" /> : null}
            {pendingBytes && !previewStale ? "삽입 갱신" : "삽입 미리보기"}
          </Button>
          <Button
            variant="success"
            disabled={!pendingBytes || previewStale}
            onClick={() => downloadPdf(pendingBytes, "signed.pdf")}
          >
            다운로드
          </Button>
        </div>
        {previewStale && pendingBytes && (
          <div className="text-warning small mt-2">
            설정이 변경되었습니다. 삽입 미리보기를 다시 눌러주세요.
          </div>
        )}
      </Col>
      <Col md={7}>
        <h6>미리보기 — 페이지 {currentPage}</h6>
        <div
          style={{
            overflow: "auto",
            maxHeight: "70vh",
            border: "1px solid var(--bs-border-color)",
            borderRadius: 4,
          }}
        >
          <canvas ref={previewCanvasRef} style={{ display: "block" }} />
        </div>
      </Col>
    </Row>
  );
};

// ── PdfHighlighter ──────────────────────────────────────────────────────────
const PdfHighlighter = ({ pdfBytes }) => {
  const renderCanvasRef = useRef(null);
  const overlayCanvasRef = useRef(null);
  const [pdfJsDoc, setPdfJsDoc] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [highlights, setHighlights] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const startPointRef = useRef(null);
  const [scale] = useState(1.5);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    pdfjsLib
      .getDocument({ data: pdfBytes.slice() })
      .promise.then((doc) => {
        setPdfJsDoc(doc);
        setTotalPages(doc.numPages);
        setHighlights([]);
      });
  }, [pdfBytes]);

  useEffect(() => {
    if (!pdfJsDoc) return;
    pdfJsDoc.getPage(currentPage).then((page) => {
      const viewport = page.getViewport({ scale });
      const canvas = renderCanvasRef.current;
      const overlay = overlayCanvasRef.current;
      if (!canvas || !overlay) return;
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      overlay.width = viewport.width;
      overlay.height = viewport.height;
      page.render({ canvasContext: canvas.getContext("2d"), viewport });
    });
  }, [pdfJsDoc, currentPage, scale]);

  const redraw = useCallback(
    (previewRect) => {
      const overlay = overlayCanvasRef.current;
      if (!overlay) return;
      const ctx = overlay.getContext("2d");
      ctx.clearRect(0, 0, overlay.width, overlay.height);
      highlights
        .filter((h) => h.page === currentPage)
        .forEach(({ x, y, w, h }) => {
          ctx.fillStyle = "rgba(255, 220, 0, 0.45)";
          ctx.fillRect(x, y, w, h);
        });
      if (previewRect) {
        ctx.fillStyle = "rgba(255, 220, 0, 0.35)";
        ctx.strokeStyle = "rgba(200, 160, 0, 0.9)";
        ctx.lineWidth = 1;
        ctx.fillRect(
          previewRect.x,
          previewRect.y,
          previewRect.w,
          previewRect.h
        );
        ctx.strokeRect(
          previewRect.x,
          previewRect.y,
          previewRect.w,
          previewRect.h
        );
      }
    },
    [highlights, currentPage]
  );

  useEffect(() => {
    redraw();
  }, [redraw]);

  const getPos = (e) => {
    const canvas = overlayCanvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const sx = canvas.width / rect.width;
    const sy = canvas.height / rect.height;
    const src = e.touches ? e.touches[0] : e;
    return {
      x: (src.clientX - rect.left) * sx,
      y: (src.clientY - rect.top) * sy,
    };
  };

  const onDown = (e) => {
    e.preventDefault();
    setIsDrawing(true);
    startPointRef.current = getPos(e);
  };

  const onMove = (e) => {
    if (!isDrawing || !startPointRef.current) return;
    e.preventDefault();
    const pos = getPos(e);
    const sp = startPointRef.current;
    redraw({
      x: Math.min(sp.x, pos.x),
      y: Math.min(sp.y, pos.y),
      w: Math.abs(pos.x - sp.x),
      h: Math.abs(pos.y - sp.y),
    });
  };

  const onUp = (e) => {
    if (!isDrawing || !startPointRef.current) return;
    const pos = getPos(e.changedTouches ? { ...e, ...e.changedTouches[0] } : e);
    const sp = startPointRef.current;
    const w = Math.abs(pos.x - sp.x);
    const h = Math.abs(pos.y - sp.y);
    if (w > 5 && h > 5) {
      const overlay = overlayCanvasRef.current;
      setHighlights((prev) => [
        ...prev,
        {
          page: currentPage,
          x: Math.min(sp.x, pos.x),
          y: Math.min(sp.y, pos.y),
          w,
          h,
          cw: overlay.width,
          ch: overlay.height,
        },
      ]);
    }
    setIsDrawing(false);
    startPointRef.current = null;
  };

  const clearPage = () =>
    setHighlights((prev) => prev.filter((h) => h.page !== currentPage));

  const save = async () => {
    setProcessing(true);
    try {
      const doc = await PDFDocument.load(pdfBytes);
      const pages = doc.getPages();
      for (const hl of highlights) {
        const page = pages[hl.page - 1];
        const { width: pw, height: ph } = page.getSize();
        const sx = pw / hl.cw;
        const sy = ph / hl.ch;
        page.drawRectangle({
          x: hl.x * sx,
          y: ph - (hl.y + hl.h) * sy,
          width: hl.w * sx,
          height: hl.h * sy,
          color: rgb(1, 0.87, 0),
          opacity: 0.45,
          borderWidth: 0,
        });
      }
      downloadPdf(await doc.save(), "highlighted.pdf");
    } finally {
      setProcessing(false);
    }
  };

  const pageHls = highlights.filter((h) => h.page === currentPage).length;

  return (
    <div>
      <div className="d-flex align-items-center gap-2 mb-3 flex-wrap">
        <Button
          size="sm"
          variant="outline-secondary"
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
        >
          ◀
        </Button>
        <span>
          {currentPage} / {totalPages}
        </span>
        <Button
          size="sm"
          variant="outline-secondary"
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
        >
          ▶
        </Button>
        <Badge bg="warning" text="dark">
          이 페이지 {pageHls}개
        </Badge>
        <Badge bg="secondary">전체 {highlights.length}개</Badge>
        <Button
          size="sm"
          variant="outline-danger"
          onClick={clearPage}
          disabled={pageHls === 0}
        >
          이 페이지 하이라이트 제거
        </Button>
        <Button
          size="sm"
          variant="success"
          onClick={save}
          disabled={highlights.length === 0 || processing}
          className="ms-auto"
        >
          {processing ? <Spinner size="sm" className="me-1" /> : null}
          하이라이트 저장
        </Button>
      </div>
      <p className="text-muted small mb-2">
        마우스를 드래그하여 하이라이트 영역을 선택하세요.
      </p>
      <div style={{ position: "relative", display: "inline-block" }}>
        <canvas ref={renderCanvasRef} style={{ display: "block" }} />
        <canvas
          ref={overlayCanvasRef}
          style={{ position: "absolute", top: 0, left: 0, cursor: "crosshair" }}
          onMouseDown={onDown}
          onMouseMove={onMove}
          onMouseUp={onUp}
          onMouseLeave={onUp}
          onTouchStart={onDown}
          onTouchMove={onMove}
          onTouchEnd={onUp}
        />
      </div>
    </div>
  );
};

// ── Main Page ───────────────────────────────────────────────────────────────
const PdfPage = () => {
  const [pdfBytes, setPdfBytes] = useState(null);
  const [fileName, setFileName] = useState("");
  const [activeTab, setActiveTab] = useState("viewer");

  useEffect(() => {
    updateTitle(`PDF Tools | ${siteName}`);
  }, []);

  const handleFile = async (file) => {
    const bytes = new Uint8Array(await file.arrayBuffer());
    setPdfBytes(bytes);
    setFileName(file.name);
    setActiveTab("viewer");
  };

  return (
    <main className="section py-5">
      <Container>
        <div className="mb-4">
          <h2 className="mb-1">PDF Tools</h2>
          <p className="text-muted mb-0">
            뷰어 · 합치기 · 페이지 편집 · 서명 · 하이라이트 — 브라우저에서
            직접 처리, 파일 서버 미전송
          </p>
        </div>

        <FileDropZone onFile={handleFile} />

        {pdfBytes && (
          <>
            <Alert
              variant="success"
              className="d-flex align-items-center gap-2 mb-4 py-2"
            >
              <span>📄</span>
              <span className="flex-grow-1">
                <strong>{fileName}</strong>
              </span>
              <Button
                size="sm"
                variant="outline-secondary"
                onClick={() => {
                  setPdfBytes(null);
                  setFileName("");
                }}
              >
                닫기
              </Button>
            </Alert>

            <Tab.Container activeKey={activeTab} onSelect={setActiveTab}>
              <Nav variant="tabs" className="mb-4">
                <Nav.Item>
                  <Nav.Link eventKey="viewer">뷰어</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="merge">합치기</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="edit">페이지 편집</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="sign">서명</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="highlight">하이라이트</Nav.Link>
                </Nav.Item>
              </Nav>

              <Tab.Content>
                <Tab.Pane eventKey="viewer">
                  <PdfViewer pdfBytes={pdfBytes} />
                </Tab.Pane>
                <Tab.Pane eventKey="merge" mountOnEnter>
                  <PdfMerge />
                </Tab.Pane>
                <Tab.Pane eventKey="edit" mountOnEnter>
                  <PdfPageEditor pdfBytes={pdfBytes} />
                </Tab.Pane>
                <Tab.Pane eventKey="sign" mountOnEnter>
                  <PdfSigner pdfBytes={pdfBytes} />
                </Tab.Pane>
                <Tab.Pane eventKey="highlight" mountOnEnter>
                  <PdfHighlighter pdfBytes={pdfBytes} />
                </Tab.Pane>
              </Tab.Content>
            </Tab.Container>
          </>
        )}
      </Container>
      <ScrollToTopButton />
    </main>
  );
};

export default PdfPage;
