import React, { useState } from "react";
import { FiDownload, FiX, FiFile, FiFileText } from "react-icons/fi";

function ExportModal({ isOpen, onClose, onExport, fileCount, isMerging }) {
  const [fileName, setFileName] = useState("merged_document");
  const [format, setFormat] = useState("pdf");

  if (!isOpen) return null;

  const handleExport = () => {
    onExport(fileName, format);
  };

  return (
    <div className="modal-overlay fixed inset-0 z-[90] flex items-center justify-center p-4">
      <div className="modal-content w-full max-w-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <FiDownload className="text-blue-400 text-xl" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Export Document</h3>
              <p className="text-xs text-dark-400">Merge & download {fileCount} file{fileCount !== 1 ? "s" : ""}</p>
            </div>
          </div>
          <button onClick={onClose} className="btn-icon text-dark-400 hover:text-white">
            <FiX className="text-lg" />
          </button>
        </div>

        <div className="mb-5">
          <label className="block text-sm font-medium text-dark-300 mb-2">
            File Name
          </label>
          <input
            type="text"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            placeholder="Enter filename"
            className="w-full bg-dark-800 border border-dark-600 rounded-lg px-4 py-2.5 text-white text-sm
              focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-colors"
            id="export-filename-input"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-dark-300 mb-2">
            Export Format
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setFormat("pdf")}
              className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${format === "pdf"
                  ? "border-blue-500 bg-blue-500/10"
                  : "border-dark-600 bg-dark-800 hover:border-dark-500"
                }`}
              id="export-format-pdf"
            >
              <FiFileText className={`text-2xl ${format === "pdf" ? "text-red-400" : "text-dark-400"}`} />
              <div className="text-left">
                <p className={`text-sm font-medium ${format === "pdf" ? "text-white" : "text-dark-300"}`}>
                  PDF
                </p>
                <p className="text-xs text-dark-500">Recommended</p>
              </div>
            </button>

            <button
              onClick={() => setFormat("docx")}
              className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${format === "docx"
                  ? "border-blue-500 bg-blue-500/10"
                  : "border-dark-600 bg-dark-800 hover:border-dark-500"
                }`}
              id="export-format-docx"
            >
              <FiFile className={`text-2xl ${format === "docx" ? "text-blue-400" : "text-dark-400"}`} />
              <div className="text-left">
                <p className={`text-sm font-medium ${format === "docx" ? "text-white" : "text-dark-300"}`}>
                  DOCX
                </p>
                <p className="text-xs text-dark-500">Word format</p>
              </div>
            </button>
          </div>

        </div>

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="btn-secondary text-sm">
            Cancel
          </button>
          <button
            onClick={handleExport}
            disabled={!fileName.trim() || isMerging}
            className="btn-primary text-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            id="export-download-btn"
          >
            {isMerging ? (
              <>
                <div className="spinner !w-4 !h-4 !border-2" />
                Merging...
              </>
            ) : (
              <>
                <FiDownload />
                Merge & Download
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ExportModal;
