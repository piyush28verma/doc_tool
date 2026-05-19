import React, { useEffect, useState, useRef, useCallback } from "react";
import * as pdfjsLib from "pdfjs-dist";
import axios from "axios";
import {
  FiChevronLeft,
  FiChevronRight,
  FiZoomIn,
  FiZoomOut,
  FiFileText,
  FiRotateCw,
  FiTrash2,
} from "react-icons/fi";

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

function DocumentPreview({ file, onToast, onPageCountUpdate }) {
  const [pdfDoc, setPdfDoc] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [zoom, setZoom] = useState(1.0);
  const [isLoading, setIsLoading] = useState(false);
  const [docxHtml, setDocxHtml] = useState("");
  const [thumbnails, setThumbnails] = useState([]);
  const [isRendering, setIsRendering] = useState(false);

  const canvasRef = useRef(null);
  const renderTaskRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!file) {
      setPdfDoc(null);
      setDocxHtml("");
      setThumbnails([]);
      return;
    }

    setPdfDoc(null);
    setDocxHtml("");
    setThumbnails([]);
    setCurrentPage(1);
    setZoom(1.0);
    setIsLoading(true);

    let cancelled = false;

    if (file.extension === ".pdf") {
      axios
        .get(`/api/files/${file.id}/download`, { responseType: "arraybuffer" })
        .then((response) => {
          if (cancelled) return;
          return pdfjsLib.getDocument({ data: new Uint8Array(response.data) }).promise;
        })
        .then((pdf) => {
          if (cancelled || !pdf) return;
          setPdfDoc(pdf);
          setTotalPages(pdf.numPages);
          setIsLoading(false);
          if (onPageCountUpdate) onPageCountUpdate(file.id, pdf.numPages);
          buildThumbnails(pdf);
        })
        .catch((err) => {
          if (cancelled) return;
          console.error("PDF load error:", err);
          setIsLoading(false);
          onToast("error", "Failed to load PDF preview");
        });
    } else if (file.extension === ".docx" || file.extension === ".doc") {
      axios
        .get(`/api/files/${file.id}/preview`)
        .then((response) => {
          if (cancelled) return;
          setDocxHtml(response.data.html);
          setTotalPages(1);
          setIsLoading(false);
        })
        .catch((err) => {
          if (cancelled) return;
          console.error("DOCX load error:", err);
          setIsLoading(false);
          onToast("error", "Failed to load document preview");
        });
    } else {
      setIsLoading(false);
    }

    return () => {
      cancelled = true;
    };
  }, [file?.id]);

  useEffect(() => {
    if (!pdfDoc || !canvasRef.current) return;

    let cancelled = false;

    if (renderTaskRef.current) {
      try { renderTaskRef.current.cancel(); } catch (e) { }
      renderTaskRef.current = null;
    }

    setIsRendering(true);

    pdfDoc.getPage(currentPage).then((page) => {
      if (cancelled || !canvasRef.current) return;

      const scale = zoom * 1.5;
      const viewport = page.getViewport({ scale });
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      canvas.width = viewport.width;
      canvas.height = viewport.height;

      const task = page.render({ canvasContext: ctx, viewport });
      renderTaskRef.current = task;

      task.promise
        .then(() => {
          if (!cancelled) setIsRendering(false);
        })
        .catch((err) => {
          if (err.name !== "RenderingCancelledException") {
            console.error("Render error:", err);
          }
          if (!cancelled) setIsRendering(false);
        });
    });

    return () => {
      cancelled = true;
    };
  }, [pdfDoc, currentPage, zoom]);

  const buildThumbnails = async (pdf) => {
    const thumbs = [];
    const max = Math.min(pdf.numPages, 20);

    for (let i = 1; i <= max; i++) {
      try {
        const page = await pdf.getPage(i);
        const vp = page.getViewport({ scale: 0.25 });
        const c = document.createElement("canvas");
        c.width = vp.width;
        c.height = vp.height;
        await page.render({ canvasContext: c.getContext("2d"), viewport: vp }).promise;
        thumbs.push(c.toDataURL());
      } catch (e) {
        thumbs.push(null);
      }
    }
    setThumbnails(thumbs);
  };

  const reloadPdf = useCallback(async () => {
    if (!file || file.extension !== ".pdf") return;
    try {
      const response = await axios.get(`/api/files/${file.id}/download`, {
        responseType: "arraybuffer",
      });
      const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(response.data) }).promise;
      setPdfDoc(pdf);
      setTotalPages(pdf.numPages);
      if (onPageCountUpdate) onPageCountUpdate(file.id, pdf.numPages);
      buildThumbnails(pdf);
    } catch (err) {
      onToast("error", "Failed to reload PDF");
    }
  }, [file?.id]);

  const goToPage = (n) => {
    if (n >= 1 && n <= totalPages) setCurrentPage(n);
  };

  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.25, 3.0));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.25, 0.5));
  const handleZoomReset = () => setZoom(1.0);

  const handleRotate = async () => {
    if (!file || file.extension !== ".pdf") return;
    try {
      await axios.post("/api/rotate", {
        fileId: file.id,
        pageIndex: currentPage - 1,
        rotationAngle: 90,
      });
      onToast("success", `Page ${currentPage} rotated`);
      await reloadPdf();
    } catch (err) {
      onToast("error", "Failed to rotate page");
    }
  };

  const handleDeletePage = async () => {
    if (!file || file.extension !== ".pdf") return;
    if (totalPages <= 1) {
      onToast("warning", "Cannot delete the only page.");
      return;
    }
    try {
      const res = await axios.post("/api/delete-page", {
        fileId: file.id,
        pageIndex: currentPage - 1,
      });
      onToast("success", `Page ${currentPage} deleted`);
      if (onPageCountUpdate) onPageCountUpdate(file.id, res.data.newPageCount);
      if (currentPage > res.data.newPageCount) setCurrentPage(res.data.newPageCount);
      await reloadPdf();
    } catch (err) {
      onToast("error", err.response?.data?.error || "Failed to delete page");
    }
  };

  if (!file) {
    return (
      <div className="preview-panel p-8 flex flex-col items-center justify-center min-h-[400px]">
        <FiFileText className="text-4xl text-dark-600 mb-3" />
        <p className="text-dark-500 text-sm">Select a file to preview</p>
      </div>
    );
  }

  return (
    <div className="preview-panel flex flex-col">
      <div className="flex items-center justify-between p-2 sm:p-3 border-b border-dark-700/50 flex-wrap gap-2">
        <h3 className="text-xs sm:text-sm font-medium text-dark-300 truncate max-w-[120px] sm:max-w-[200px]">
          {file.originalName}
        </h3>

        {file.extension === ".pdf" && !isLoading && pdfDoc && (
          <div className="flex items-center gap-1">
            <button onClick={handleZoomOut} className="btn-icon text-dark-400 hover:text-white" title="Zoom out">
              <FiZoomOut />
            </button>
            <span className="text-xs text-dark-400 w-12 text-center font-mono">
              {Math.round(zoom * 100)}%
            </span>
            <button onClick={handleZoomIn} className="btn-icon text-dark-400 hover:text-white" title="Zoom in">
              <FiZoomIn />
            </button>

            <div className="w-px h-5 bg-dark-600 mx-1" />

            <button onClick={handleRotate} className="btn-icon text-dark-400 hover:text-blue-400" title="Rotate page 90°">
              <FiRotateCw className="text-sm" />
            </button>
            <button onClick={handleDeletePage} className="btn-icon text-dark-400 hover:text-red-400" title="Delete this page">
              <FiTrash2 className="text-sm" />
            </button>
          </div>
        )}
      </div>

      {isLoading && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="spinner mb-3" />
          <p className="text-dark-400 text-sm">Loading preview...</p>
        </div>
      )}

      {!isLoading && file.extension === ".pdf" && pdfDoc && (
        <div className="flex flex-col">
          <div
            ref={containerRef}
            className="overflow-auto bg-dark-950 p-4"
            style={{ maxHeight: "500px", textAlign: "center" }}
          >
            <canvas
              ref={canvasRef}
              style={{ display: "inline-block", maxWidth: "none" }}
            />
          </div>

          <div className="flex items-center justify-center gap-3 p-3 border-t border-dark-700/50">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage <= 1}
              className="btn-icon text-dark-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <FiChevronLeft />
            </button>
            <span className="text-sm text-dark-300">
              Page <span className="text-white font-medium">{currentPage}</span> of{" "}
              <span className="text-white font-medium">{totalPages}</span>
            </span>
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="btn-icon text-dark-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <FiChevronRight />
            </button>
          </div>

          {thumbnails.length > 1 && (
            <div className="flex gap-2 p-3 overflow-x-auto border-t border-dark-700/50">
              {thumbnails.map((thumb, i) => (
                <button
                  key={i}
                  onClick={() => goToPage(i + 1)}
                  className={`page-thumbnail flex-shrink-0 ${currentPage === i + 1 ? "active" : ""}`}
                  title={`Page ${i + 1}`}
                >
                  {thumb ? (
                    <img src={thumb} alt={`Page ${i + 1}`} className="h-16 w-auto" />
                  ) : (
                    <div className="h-16 w-12 bg-dark-700 flex items-center justify-center">
                      <span className="text-xs text-dark-500">{i + 1}</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {!isLoading && (file.extension === ".docx" || file.extension === ".doc") && docxHtml && (
        <div className="p-4">
          <div className="docx-preview" dangerouslySetInnerHTML={{ __html: docxHtml }} />
        </div>
      )}
    </div>
  );
}

export default DocumentPreview;
