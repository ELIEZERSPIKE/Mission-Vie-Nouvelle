import { useEffect, useRef, useState, useCallback } from "react";
import * as pdfjsLib from "pdfjs-dist";
import type { PDFDocumentLoadingTask } from "pdfjs-dist";
import axiosClient from "../../../api/axiosClient";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

interface ProtectedPdfViewerProps {
  /** Endpoint backend protégé (ex: /api/v1/content/123) — jamais une URL de fichier public */
  fileUrl: string;
  /** Token JWT à envoyer en header Authorization. */
  authToken: string;
  /** Fallback si le backend ne renvoie pas de header X-Watermark-Identity */
  watermarkText?: string;
  scale?: number;
}

export default function ProtectedPdfViewer({
  fileUrl,
  authToken,
  watermarkText = "",
  scale = 1.4,
}: ProtectedPdfViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [numPages, setNumPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const drawWatermark = useCallback(
    (ctx: CanvasRenderingContext2D, width: number, height: number, text: string) => {
      ctx.save();
      ctx.globalAlpha = 0.12;
      ctx.fillStyle = "#000000";
      ctx.font = "bold 20px sans-serif";
      ctx.translate(width / 2, height / 2);
      ctx.rotate(-Math.PI / 6);

      const stepX = 260;
      const stepY = 160;
      for (let y = -height; y < height; y += stepY) {
        for (let x = -width; x < width; x += stepX) {
          ctx.fillText(text, x, y);
        }
      }
      ctx.restore();
    },
    []
  );

  useEffect(() => {
    let cancelled = false;
    let loadingTask: PDFDocumentLoadingTask | null = null;

    async function renderAll() {
      setLoading(true);
      setError(null);
      try {
        // Récupération via axiosClient (au lieu d'un fetch brut) pour profiter
        // de l'intercepteur : ajout du token et rafraîchissement automatique
        // lors d'un 401 — le viewer reste donc fonctionnel quand le token expire.
        const res = await axiosClient.get(fileUrl, {
          responseType: "arraybuffer",
        });
        if (cancelled) return;

        const watermark =
          (res.headers["x-watermark-identity"] as string | undefined) || watermarkText;
        const arrayBuffer = res.data as ArrayBuffer;

        loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        const pdfDoc = await loadingTask.promise;
        if (cancelled) return;

        setNumPages(pdfDoc.numPages);
        const container = containerRef.current;
        if (!container) return;
        container.innerHTML = "";

        for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
          if (cancelled) return;
          const page = await pdfDoc.getPage(pageNum);
          const viewport = page.getViewport({ scale });

          const canvas = document.createElement("canvas");
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          canvas.className = "pdf-page-canvas";
          canvas.setAttribute("draggable", "false");

          const ctx = canvas.getContext("2d");
          if (!ctx) continue;
          await page.render({ canvasContext: ctx, viewport, canvas }).promise;
          if (cancelled) return;

          drawWatermark(ctx, viewport.width, viewport.height, watermark);

          // Chaque page est présentée comme une feuille blanche ombrée,
          // avec son numéro en dessous — plus lisible et plus documentées.
          const pageWrapper = document.createElement("div");
          pageWrapper.className = "pdf-page";

          const pageNumber = document.createElement("span");
          pageNumber.className = "pdf-page-number";
          pageNumber.textContent = `Page ${pageNum} / ${pdfDoc.numPages}`;

          pageWrapper.appendChild(canvas);
          pageWrapper.appendChild(pageNumber);
          container.appendChild(pageWrapper);
        }
      } catch (e) {
        if (!cancelled) setError("Impossible de charger le document.");
        console.error(e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    renderAll();

    return () => {
      cancelled = true;
      // loadingTask.destroy() est toujours une fonction valide, dès la
      // création du loadingTask, peu importe où en est la résolution de
      // la promesse — contrairement au document résolu (pdfDoc), qui peut
      // être dans un état incohérent selon le timing du démontage.
      loadingTask?.destroy();
    };
  }, [fileUrl, authToken, scale, watermarkText, drawWatermark]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const blockContextMenu = (e: MouseEvent) => e.preventDefault();
    const blockDragStart = (e: DragEvent) => e.preventDefault();
    const blockShortcuts = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      const isCtrlOrCmd = e.ctrlKey || e.metaKey;
      if (isCtrlOrCmd && (key === "s" || key === "p")) {
        e.preventDefault();
      }
      if (key === "printscreen") {
        e.preventDefault();
      }
    };

    el.addEventListener("contextmenu", blockContextMenu);
    el.addEventListener("dragstart", blockDragStart);
    window.addEventListener("keydown", blockShortcuts);

    return () => {
      el.removeEventListener("contextmenu", blockContextMenu);
      el.removeEventListener("dragstart", blockDragStart);
      window.removeEventListener("keydown", blockShortcuts);
    };
  }, []);

  return (
    <div className="pdf-viewer-wrapper">
      {loading && (
        <div className="pdf-viewer-loading" role="status">
          <span className="pdf-viewer-spinner" aria-hidden="true" />
          <p>Préparation du document…</p>
        </div>
      )}
      {error && <p className="pdf-viewer-status pdf-viewer-error">{error}</p>}

      <div
        ref={containerRef}
        className="pdf-viewer-container"
        onContextMenu={(e) => e.preventDefault()}
        style={{
          userSelect: "none",
          WebkitUserSelect: "none",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1.25rem",
        }}
      />

      {numPages > 0 && !loading && (
        <p className="pdf-viewer-status">
          <span className="pdf-viewer-count">{numPages} page{numPages > 1 ? "s" : ""}</span>
        </p>
      )}

      <style>{`
        .pdf-page {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          background: #ffffff;
          padding: 0.35rem;
          border-radius: 4px;
          box-shadow: 0 1px 2px rgba(30, 42, 58, 0.08), 0 6px 18px rgba(30, 42, 58, 0.10);
          max-width: 100%;
        }
        .pdf-page-canvas {
          max-width: 100%;
          height: auto;
          background: #ffffff;
          pointer-events: none;
          border-radius: 2px;
        }
        .pdf-page-number {
          font-size: 0.7rem;
          letter-spacing: 0.02em;
          color: #6b7a6c;
        }
        .pdf-viewer-status {
          text-align: center;
          color: #6b7a6c;
          font-size: 0.9rem;
        }
        .pdf-viewer-count {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          border: 1px solid #c9d2c9;
          background: #f2f4ef;
          color: #4b5d52;
          border-radius: 999px;
          padding: 0.35rem 0.9rem;
          font-size: 0.78rem;
          font-weight: 600;
        }
        .pdf-viewer-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
          padding: 2.5rem 1rem;
          color: #6b7a6c;
          font-size: 0.9rem;
        }
        .pdf-viewer-spinner {
          width: 2rem;
          height: 2rem;
          border-radius: 50%;
          border: 3px solid #c9d2c9;
          border-top-color: #334f1c;
          animation: pdf-spin 0.8s linear infinite;
        }
        @keyframes pdf-spin {
          to { transform: rotate(360deg); }
        }
        .pdf-viewer-error {
          color: #b0331f;
          font-weight: 500;
        }
        @media print {
          .pdf-viewer-wrapper {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}