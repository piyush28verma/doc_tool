import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Header from "./components/Header";
import FileUpload from "./components/FileUpload";
import FileList from "./components/FileList";
import DocumentPreview from "./components/DocumentPreview";
import ExportModal from "./components/ExportModal";
import Toast from "./components/Toast";
import ConfirmDialog from "./components/ConfirmDialog";
import { FiDownload, FiTrash2 } from "react-icons/fi";

function App() {
  const [files, setFiles] = useState([]);             // All uploaded files
  const [selectedFileId, setSelectedFileId] = useState(null); // Currently previewed file
  const [checkedFiles, setCheckedFiles] = useState([]); // Files selected with checkboxes
  const [isUploading, setIsUploading] = useState(false);
  const [isMerging, setIsMerging] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, fileId: null });

  const addToast = useCallback((type, message) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, type, message }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const response = await axios.get("/api/files");
      setFiles(response.data.files);
    } catch (error) {
      console.log("Could not fetch files:", error.message);
    }
  };

  const handleFilesSelected = async (validFiles, errors) => {
    errors.forEach((err) => addToast("error", err));

    if (validFiles.length === 0) return;

    setIsUploading(true);

    try {
      const formData = new FormData();
      validFiles.forEach((file) => {
        formData.append("files", file);
      });

      const response = await axios.post("/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setFiles((prev) => [...prev, ...response.data.files]);
      addToast("success", `${response.data.files.length} file(s) uploaded successfully`);

      if (!selectedFileId && response.data.files.length > 0) {
        setSelectedFileId(response.data.files[0].id);
      }
    } catch (error) {
      const errorMsg = error.response?.data?.error || "Upload failed. Is the server running?";
      addToast("error", errorMsg);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSelectFile = (fileId) => {
    setSelectedFileId(fileId);
  };

  const handleCheckFile = (fileId) => {
    setCheckedFiles((prev) =>
      prev.includes(fileId) ? prev.filter((id) => id !== fileId) : [...prev, fileId]
    );
  };

  const handleSelectAll = () => {
    setCheckedFiles(files.map((f) => f.id));
  };

  const handleDeselectAll = () => {
    setCheckedFiles([]);
  };

  const handleDeleteRequest = (fileId) => {
    setConfirmDialog({ isOpen: true, fileId });
  };

  const handleDeleteConfirm = async () => {
    const fileId = confirmDialog.fileId;
    setConfirmDialog({ isOpen: false, fileId: null });

    try {
      await axios.delete(`/api/files/${fileId}`);

      setFiles((prev) => prev.filter((f) => f.id !== fileId));
      setCheckedFiles((prev) => prev.filter((id) => id !== fileId));

      if (selectedFileId === fileId) {
        setSelectedFileId(null);
      }

      addToast("success", "File deleted successfully");
    } catch (error) {
      addToast("error", "Failed to delete file");
    }
  };

  const handleDeleteCancel = () => {
    setConfirmDialog({ isOpen: false, fileId: null });
  };

  const handleBulkDelete = async () => {
    if (checkedFiles.length === 0) {
      addToast("warning", "No files selected");
      return;
    }

    for (const fileId of checkedFiles) {
      try {
        await axios.delete(`/api/files/${fileId}`);
      } catch (e) {
      }
    }

    setFiles((prev) => prev.filter((f) => !checkedFiles.includes(f.id)));
    if (checkedFiles.includes(selectedFileId)) {
      setSelectedFileId(null);
    }
    addToast("success", `${checkedFiles.length} file(s) deleted`);
    setCheckedFiles([]);
  };

  const handleExport = async (fileName, format) => {
    if (files.length === 0) {
      addToast("warning", "No files to merge");
      return;
    }

    setIsMerging(true);

    try {
      const fileIds = files.map((f) => f.id);

      const response = await axios.post(
        "/api/merge",
        { fileIds, exportFormat: format },
        { responseType: "blob" }
      );

      const blob = new Blob([response.data], {
        type: format === "pdf" ? "application/pdf" : "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${fileName}.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      addToast("success", "Document merged and downloaded!");
      setShowExportModal(false);
    } catch (error) {
      addToast("error", "Merge failed. Please try again.");
    } finally {
      setIsMerging(false);
    }
  };

  const handlePageCountUpdate = (fileId, pageCount) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === fileId ? { ...f, pageCount } : f))
    );
  };

  const selectedFile = files.find((f) => f.id === selectedFileId) || null;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <Toast toasts={toasts} removeToast={removeToast} />

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title="Delete File"
        message="Are you sure you want to delete this file? This action cannot be undone."
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />

      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        onExport={handleExport}
        fileCount={files.length}
        isMerging={isMerging}
      />

      <main className="flex-1 w-full px-4 sm:px-6 lg:px-10 py-6">
        <section className="mb-6">
          <FileUpload onFilesSelected={handleFilesSelected} isUploading={isUploading} />
        </section>

        {files.length > 0 && (
          <section className="flex flex-wrap items-center justify-between gap-3 mb-4 animate-fade-in">
            <div className="flex items-center gap-2">
              {checkedFiles.length > 0 && (
                <button
                  onClick={handleBulkDelete}
                  className="btn-danger text-xs flex items-center gap-1.5"
                  id="bulk-delete-btn"
                >
                  <FiTrash2 className="text-sm" />
                  <span className="hidden sm:inline">Delete Selected</span>
                  <span className="sm:hidden">Delete</span>
                  ({checkedFiles.length})
                </button>
              )}
            </div>
            <button
              onClick={() => setShowExportModal(true)}
              className="btn-primary text-xs sm:text-sm flex items-center gap-2"
              id="merge-export-btn"
            >
              <FiDownload />
              Merge & Export
            </button>
          </section>
        )}

        {files.length > 0 && (
          <section className="grid grid-cols-1 lg:grid-cols-[minmax(300px,1fr)_1.5fr] gap-4 sm:gap-6 animate-slide-up">
            <div className="glass-card p-3 sm:p-4 lg:max-h-[600px] overflow-y-auto">
              <FileList
                files={files}
                setFiles={setFiles}
                selectedFileId={selectedFileId}
                onSelectFile={handleSelectFile}
                checkedFiles={checkedFiles}
                onCheckFile={handleCheckFile}
                onDeleteFile={handleDeleteRequest}
                onSelectAll={handleSelectAll}
                onDeselectAll={handleDeselectAll}
              />
            </div>

            <div className="min-w-0">
              <DocumentPreview
                file={selectedFile}
                onToast={addToast}
                onPageCountUpdate={handlePageCountUpdate}
              />
            </div>
          </section>
        )}
      </main>

      <footer className="border-t border-dark-700/30 py-4 mt-auto">
        <p className="text-center text-xs text-dark-500">
          DocMerge — Multi-File Document Combiner & Export Tool
        </p>
      </footer>
    </div>
  );
}

export default App;
