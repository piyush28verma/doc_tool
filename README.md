# DocMerge

A full-stack document combiner and export tool. Upload PDF, DOC, and DOCX files, reorder them with drag-and-drop, preview content, and merge everything into a single downloadable file.

## Features

- Drag-and-drop file upload with click-to-browse fallback
- File validation (PDF, DOC, DOCX only, 50MB limit)
- Drag-and-drop reordering to control merge order
- Batch selection with select all / deselect all
- Individual and bulk file deletion with confirmation
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

## Tech Stack

**Frontend:** React 18, Tailwind CSS, @dnd-kit, pdfjs-dist, axios, react-icons

**Backend:** Node.js, Express, multer, pdf-merger-js, pdf-lib, pdfjs-dist, mammoth, pdfkit, docx

## Prerequisites

- Node.js v16 or higher
- npm v8 or higher

## Setup

### 1. Clone and install

```bash
git clone https://github.com/YOUR_USERNAME/doc_tool.git
cd doc_tool
```

### 2. Start the backend

```bash
cd backend
npm install
node server.js
```

Backend runs on http://localhost:5001

### 3. Start the frontend (new terminal)

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on http://localhost:3000

### 4. Open the app

Go to http://localhost:3000 in your browser. Both servers need to be running.

## Project Structure

```
doc_tool/
├── backend/
│   ├── package.json
│   ├── server.js
│   └── uploads/
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── index.css
│       └── components/
│           ├── Header.jsx
│           ├── FileUpload.jsx
│           ├── FileList.jsx
│           ├── DocumentPreview.jsx
│           ├── ExportModal.jsx
│           ├── Toast.jsx
│           └── ConfirmDialog.jsx
└── README.md
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/upload | Upload files (multipart/form-data) |
| GET | /api/files | List all uploaded files |
| GET | /api/files/:id/download | Download a specific file |
| GET | /api/files/:id/preview | Get DOCX preview as HTML |
| DELETE | /api/files/:id | Delete a file |
| POST | /api/merge | Merge files into PDF or DOCX |
| POST | /api/rotate | Rotate a PDF page |
| POST | /api/delete-page | Remove a page from a PDF |

## How to Use

1. Drag files onto the upload zone or click to browse
2. Drag files up and down to set the merge order
3. Click a file to preview its content
4. Use rotate and delete buttons to edit PDF pages
5. Click "Merge & Export", pick a filename and format, then download

## Architecture

The frontend is a React single-page app that handles all UI, PDF rendering (pdf.js canvas), DOCX preview (HTML from backend), and drag-and-drop reordering.

The backend is an Express server that stores uploaded files on disk and handles all document processing. For PDF export, it converts DOCX/DOC files to PDF (mammoth + pdfkit), then merges all PDFs into one using pdf-merger-js. For DOCX export, it extracts text from PDFs (pdfjs-dist) and DOCX files (mammoth), then creates a combined DOCX using the docx package. It also provides page-level operations like rotation and deletion using pdf-lib.

In development, the frontend proxies API calls to the backend through Vite's dev server proxy. In production, the backend serves the built frontend as static files.

## Challenges and Solutions

1. **DOCX Preview** — Browsers can't render DOCX natively. Used mammoth.js on the backend to convert DOCX to HTML, then displayed the HTML in the frontend.

2. **PDF Page Operations** — Used pdf-lib to rotate and delete pages in-place on the server without requiring a re-upload.

3. **PDF Export** — DOCX and DOC files are first converted to PDF using mammoth (text extraction) and pdfkit (PDF creation), then all PDFs are merged into a single file using pdf-merger-js.

4. **DOCX Export** — Text is extracted from PDFs using pdfjs-dist and from DOCX files using mammoth, then everything is assembled into a valid DOCX file using the docx package.

5. **Drag-and-Drop Reordering** — Used @dnd-kit for accessible drag-and-drop with pointer and keyboard sensor support.
