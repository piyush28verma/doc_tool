<div align="center">

# DocMerge

**A free, open-source document combiner and export tool.**

Upload PDF, DOC, and DOCX files, reorder, preview, edit pages, and merge into a single downloadable document.

[![CI](https://github.com/piyush28verma/doc_tool/actions/workflows/ci.yml/badge.svg)](https://github.com/piyush28verma/doc_tool/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green.svg)](https://nodejs.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![GitHub stars](https://img.shields.io/github/stars/piyush28verma/doc_tool?style=social)](https://github.com/piyush28verma/doc_tool/stargazers)

[**Live Demo →**](https://doc-tool.onrender.com/) · [Report Bug](https://github.com/piyush28verma/doc_tool/issues/new?template=bug_report.md) · [Request Feature](https://github.com/piyush28verma/doc_tool/issues/new?template=feature_request.md)

</div>

---

## Why DocMerge?

Most document merging tools are paywalled, ad-heavy, or send your files to third-party servers. DocMerge is different:

- **Completely free** - no watermarks, no file size tricks, no signup walls
- **Privacy-first** - your files stay on the server you control, never shared with third parties
- **Self-hostable** - run it on your own machine or server with Docker
- **Open source** - inspect, modify, and contribute to the code

## Features

- **Drag-and-drop upload** with click-to-browse fallback
- **File validation** - PDF, DOC, DOCX only, 50MB limit per file
- **Drag-and-drop reordering** to control merge order
- **Batch selection** with select all / deselect all
- **Individual and bulk file deletion** with confirmation dialogs
- **PDF preview** rendered on canvas using pdf.js
- **DOCX preview** via mammoth HTML conversion
- **Page navigation** with next/previous controls
- **Page thumbnail strip** for quick navigation
- **Zoom in and zoom out** for PDF preview
- **Export as PDF or DOCX** with custom filename
- **Rotate individual PDF pages** by 90 degrees
- **Delete specific pages** from a PDF before merging
- **Toast notifications** for success, error, and warning states
- **Responsive layout** for desktop, tablet, and mobile
- **Loading spinners** during upload and merge operations

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React 18, Tailwind CSS, @dnd-kit, pdfjs-dist, axios, react-icons |
| **Backend** | Node.js, Express, multer, pdf-merger-js, pdf-lib, pdfjs-dist, mammoth, pdfkit, docx |
| **DevTools** | Vite, PostCSS, Autoprefixer |

## Quick Start

### Prerequisites

- Node.js v18 or higher
- npm v8 or higher

### 1. Clone the repository

```bash
git clone https://github.com/piyush28verma/doc_tool.git
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

### Docker (Alternative)

```bash
docker compose up --build
```

App will be available at http://localhost:5001

## Project Structure

```
doc_tool/
├── .github/
│   ├── ISSUE_TEMPLATE/          # Bug report & feature request templates
│   ├── workflows/ci.yml         # GitHub Actions CI pipeline
│   ├── PULL_REQUEST_TEMPLATE.md
│   └── FUNDING.yml
├── backend/
│   ├── server.js                # Express server with all API routes
│   ├── package.json
│   └── uploads/                 # Temporary file storage (gitignored)
├── frontend/
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── src/
│       ├── main.jsx             # React entry point
│       ├── App.jsx              # Main application component
│       ├── index.css            # Tailwind + custom styles
│       └── components/
│           ├── Header.jsx       # App header with branding
│           ├── FileUpload.jsx   # Drag-and-drop upload zone
│           ├── FileList.jsx     # Sortable file list with actions
│           ├── DocumentPreview.jsx  # PDF/DOCX preview with controls
│           ├── ExportModal.jsx  # Export format & filename dialog
│           ├── Toast.jsx        # Notification toasts
│           └── ConfirmDialog.jsx # Confirmation dialogs
├── CONTRIBUTING.md
├── CODE_OF_CONDUCT.md
├── SECURITY.md
├── CHANGELOG.md
├── LICENSE                      # MIT License
├── Dockerfile
├── docker-compose.yml
└── README.md
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/upload` | Upload files (multipart/form-data, max 20 files) |
| `GET` | `/api/files` | List all uploaded files with metadata |
| `GET` | `/api/files/:id/download` | Download a specific file |
| `GET` | `/api/files/:id/preview` | Get DOCX preview as HTML |
| `DELETE` | `/api/files/:id` | Delete a file |
| `POST` | `/api/merge` | Merge files into PDF or DOCX |
| `POST` | `/api/rotate` | Rotate a PDF page by 90° |
| `POST` | `/api/delete-page` | Remove a specific page from a PDF |

## How to Use

1. **Upload** - Drag files onto the upload zone or click to browse
2. **Reorder** - Drag files up and down to set the merge order
3. **Preview** - Click a file to preview its content
4. **Edit** - Use rotate and delete buttons to edit PDF pages
5. **Export** - Click "Merge & Export", pick a filename and format, then download

## Roadmap

- [ ] Add comprehensive test suite (Jest + React Testing Library)
- [ ] Extract core merging logic into a standalone npm package
- [ ] Support additional formats (PPT/PPTX, images, spreadsheets)
- [ ] Add OCR support for scanned PDFs
- [ ] Watermark and password-protected PDF support
- [ ] Internationalization (i18n) support
- [ ] Accessibility (a11y) audit and improvements
- [ ] Kubernetes / Helm chart for deployment

See the [open issues](https://github.com/piyush28verma/doc_tool/issues) for a full list of proposed features and known issues.

## Contributing

Contributions are what make the open-source community great. Any contributions you make are **greatly appreciated**.

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, development setup, and the process for submitting pull requests.

**Areas where help is wanted:**
- Test coverage (backend and frontend)
- Internationalization
- Accessibility improvements
- New document format support
- Mobile UX improvements

## Architecture

The **frontend** is a React single-page app that handles all UI, PDF rendering (pdf.js canvas), DOCX preview (HTML from backend), and drag-and-drop reordering.

The **backend** is an Express server that stores uploaded files on disk and handles all document processing:
- **PDF export**: Converts DOCX/DOC → PDF (mammoth + pdfkit), then merges all PDFs using pdf-merger-js
- **DOCX export**: Extracts text from PDFs (pdfjs-dist) and DOCX files (mammoth), creates combined DOCX using the docx package
- **Page operations**: Rotation and deletion using pdf-lib

In development, the frontend proxies API calls to the backend through Vite's dev server proxy. In production, the backend serves the built frontend as static files.

## License

Distributed under the MIT License. See [LICENSE](LICENSE) for more information.

## Acknowledgments

- [pdf-lib](https://github.com/Hopding/pdf-lib) - PDF manipulation in JavaScript
- [pdf-merger-js](https://github.com/nickmomrik/pdf-merger-js) - PDF merging
- [pdfjs-dist](https://github.com/nickmomrik/pdf-merger-js) - PDF rendering and text extraction
- [mammoth](https://github.com/mwilliamson/mammoth.js) - DOCX to HTML conversion
- [@dnd-kit](https://github.com/clauderic/dnd-kit) - Drag and drop toolkit for React
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework

---

<div align="center">

Made with ❤️ by [Piyush Verma](https://github.com/piyush28verma)

Star this repo if you find it useful!

</div>
