# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-11-07

### Added

- Drag-and-drop file upload with click-to-browse fallback
- File validation for PDF, DOC, and DOCX formats (50MB size limit)
- Drag-and-drop reordering to control merge order
- Batch selection with select all / deselect all
- Individual and bulk file deletion with confirmation dialogs
- PDF preview rendered on canvas using pdf.js
- DOCX preview via mammoth HTML conversion
- Page navigation with next/previous controls
- Page thumbnail strip for quick navigation
- Zoom in and zoom out for PDF preview
- Export merged document as PDF or DOCX
- Custom filename for exported documents
- Rotate individual PDF pages by 90 degrees
- Delete specific pages from a PDF before merging
- Toast notifications for success, error, and warning states
- Responsive layout for desktop, tablet, and mobile
- Loading spinners during upload and merge operations
- Backend API with Express for file upload, merge, rotate, and delete operations
- Production build serving via Express static files
- Deployed on Render at doc-tool.onrender.com

[1.0.0]: https://github.com/piyush28verma/doc_tool/releases/tag/v1.0.0
