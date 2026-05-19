import React, { useRef, useState } from "react";
import { FiUploadCloud, FiFile } from "react-icons/fi";

function FileUpload({ onFilesSelected, isUploading }) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const ALLOWED_TYPES = [".pdf", ".doc", ".docx"];
  const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

  const validateFiles = (fileList) => {
    const validFiles = [];
    const errors = [];

    Array.from(fileList).forEach((file) => {
      const extension = "." + file.name.split(".").pop().toLowerCase();

      if (!ALLOWED_TYPES.includes(extension)) {
        errors.push(`"${file.name}" is not a supported format. Only PDF, DOC, DOCX allowed.`);
      } else if (file.size > MAX_FILE_SIZE) {
        errors.push(`"${file.name}" is too large. Maximum size is 50MB.`);
      } else {
        validFiles.push(file);
      }
    });

    return { validFiles, errors };
  };

  const handleFiles = (fileList) => {
    const { validFiles, errors } = validateFiles(fileList);
    onFilesSelected(validFiles, errors);
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleInputChange = (e) => {
    if (e.target.files.length > 0) {
      handleFiles(e.target.files);
      e.target.value = "";
    }
  };

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".pdf,.doc,.docx"
        onChange={handleInputChange}
        className="hidden"
        id="file-upload-input"
      />

      <div
        className={`upload-zone p-8 sm:p-12 text-center cursor-pointer ${isDragging ? "dragging" : ""}`}
        onClick={handleClick}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        role="button"
        tabIndex={0}
        aria-label="Upload files by clicking or dragging"
      >
        {isUploading ? (

          <div className="flex flex-col items-center gap-4">
            <div className="spinner" />
            <p className="text-dark-300 text-sm">Uploading files...</p>
          </div>
        ) : (

          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center">
              <FiUploadCloud className="text-blue-400 text-3xl" />
            </div>
            <div>
              <p className="text-white font-semibold text-lg">
                {isDragging ? "Drop your files here" : "Drag & drop files here"}
              </p>
              <p className="text-dark-400 text-sm mt-1">
                or <span className="text-blue-400 underline">click to browse</span>
              </p>
            </div>
            <div className="flex items-center gap-2 mt-2">
              {["PDF", "DOC", "DOCX"].map((type) => (
                <span
                  key={type}
                  className="text-xs bg-dark-700/50 text-dark-300 px-2.5 py-1 rounded-full border border-dark-600"
                >
                  {type}
                </span>
              ))}
              <span className="text-xs text-dark-500 ml-1">Max 50MB each</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default FileUpload;
