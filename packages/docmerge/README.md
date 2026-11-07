# docmerge

> Merge, rotate, and manipulate PDF and DOCX documents in Node.js.

[![npm version](https://img.shields.io/npm/v/docmerge.svg)](https://www.npmjs.com/package/docmerge)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](../../LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-16%2B-green.svg)](https://nodejs.org/)

Combine multiple PDF, DOCX, and DOC files into a single document. Rotate or delete individual PDF pages. Extract text from PDFs and DOCX files. Zero external services — everything runs locally.

## Install

```bash
npm install docmerge
```

## Quick Start

```js
const { mergeToPdf, mergeToDocx, rotatePage, deletePage, extractPdfText } = require('docmerge');
const fs = require('fs');

// Merge files into a single PDF
const pdfBuffer = await mergeToPdf([
  'chapter1.pdf',
  'chapter2.docx',
  'appendix.pdf',
]);
fs.writeFileSync('book.pdf', pdfBuffer);

// Merge files into a single DOCX
const docxBuffer = await mergeToDocx([
  { path: 'report.pdf', name: 'Q4 Report' },
  { path: 'summary.docx', name: 'Executive Summary' },
]);
fs.writeFileSync('combined.docx', docxBuffer);
```

## API

### `mergeToPdf(files, options?)`

Merge multiple documents into a single PDF.

| Parameter | Type | Description |
|-----------|------|-------------|
| `files` | `Array<string \| {path, name?}>` | File paths or objects with path and optional display name |
| `options.tempDir` | `string` | Temp directory for intermediate files (default: `os.tmpdir()`) |

**Returns:** `Promise<Buffer>` — the merged PDF

**Supported formats:** `.pdf`, `.docx`, `.doc`

---

### `mergeToDocx(files)`

Merge multiple documents into a single DOCX. Text is extracted from each file and combined with headings.

| Parameter | Type | Description |
|-----------|------|-------------|
| `files` | `Array<string \| {path, name?}>` | File paths or objects with path and optional display name |

**Returns:** `Promise<Buffer>` — the merged DOCX

---

### `rotatePage(filePath, pageIndex, angle?)`

Rotate a specific page in a PDF.

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `filePath` | `string` | — | Path to PDF |
| `pageIndex` | `number` | — | Zero-based page index |
| `angle` | `number` | `90` | Rotation angle in degrees |

**Returns:** `Promise<Buffer>` — the modified PDF

---

### `deletePage(filePath, pageIndex)`

Remove a specific page from a PDF.

| Parameter | Type | Description |
|-----------|------|-------------|
| `filePath` | `string` | Path to PDF |
| `pageIndex` | `number` | Zero-based page index |

**Returns:** `Promise<{buffer: Buffer, pageCount: number}>`

---

### `getPageCount(filePath)`

Get the number of pages in a PDF.

**Returns:** `Promise<number>`

---

### `extractPdfText(filePath)`

Extract all text content from a PDF file.

**Returns:** `Promise<string>`

---

### `extractDocxText(filePath)`

Extract all text content from a DOCX file.

**Returns:** `Promise<string>`

## Use Cases

- **Document assembly** — Combine contracts, reports, and appendices into a single file
- **Batch processing** — Merge hundreds of invoices or receipts
- **Build pipelines** — Generate combined documentation from multiple sources
- **Academic** — Merge research papers, citations, and supplementary materials
- **Legal** — Combine case files, exhibits, and filings

## Part of DocMerge

This package is the core engine behind [DocMerge](https://github.com/piyush28verma/doc_tool), a free, open-source document combiner web app. Try the live demo at [doc-tool.onrender.com](https://doc-tool.onrender.com/).

## License

MIT © [Piyush Verma](https://github.com/piyush28verma)

