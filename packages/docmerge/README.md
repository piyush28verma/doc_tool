<div align="center">

# 📄 docmerge

**Merge, rotate, and manipulate PDF & DOCX documents in Node.js**

[![npm version](https://img.shields.io/npm/v/@piyush28verma/docmerge.svg)](https://www.npmjs.com/package/@piyush28verma/docmerge)
[![npm downloads](https://img.shields.io/npm/dm/@piyush28verma/docmerge.svg)](https://www.npmjs.com/package/@piyush28verma/docmerge)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/piyush28verma/doc_tool/blob/main/LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D16-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-types%20included-blue.svg)](https://www.npmjs.com/package/@piyush28verma/docmerge)

Combine multiple PDF, DOCX, and DOC files into a single document. Rotate or delete individual pages. Extract text. Everything runs locally — no external APIs, no cloud services, no data leaves your machine.

[GitHub](https://github.com/piyush28verma/doc_tool) · [Live Demo](https://doc-tool.onrender.com/) · [Report Bug](https://github.com/piyush28verma/doc_tool/issues)

</div>

---

## Install

```bash
npm install @piyush28verma/docmerge
```

## Why docmerge?

- 🔒 **Runs 100% locally** — no files uploaded to external servers
- 📄 **Multi-format** — handles PDF, DOCX, and DOC files
- 🔀 **Merge to PDF or DOCX** — choose your output format
- ✂️ **Page-level control** — rotate, delete, and count individual pages
- 📝 **Text extraction** — pull text from PDFs and DOCX files
- 📦 **Zero config** — no API keys, no setup, just install and use
- 🏷️ **TypeScript ready** — full type definitions included

## Quick Start

```js
const { mergeToPdf, mergeToDocx } = require('@piyush28verma/docmerge');
const fs = require('fs');

// Merge multiple documents into one PDF
const pdf = await mergeToPdf([
  'chapter1.pdf',
  'chapter2.docx',
  'appendix.pdf'
]);
fs.writeFileSync('book.pdf', pdf);
```

```js
// Merge into DOCX with custom section names
const docx = await mergeToDocx([
  { path: 'report.pdf', name: 'Q4 Report' },
  { path: 'summary.docx', name: 'Executive Summary' }
]);
fs.writeFileSync('combined.docx', docx);
```

```js
// Page-level operations
const { rotatePage, deletePage, getPageCount } = require('@piyush28verma/docmerge');

const count = await getPageCount('document.pdf');         // 12
const rotated = await rotatePage('document.pdf', 0, 90);  // rotate first page
const { buffer } = await deletePage('document.pdf', 5);   // remove page 6
```

```js
// Text extraction
const { extractPdfText, extractDocxText } = require('@piyush28verma/docmerge');

const pdfText = await extractPdfText('paper.pdf');
const docxText = await extractDocxText('report.docx');
```

## API Reference

### Merging

#### `mergeToPdf(files, options?)` → `Promise<Buffer>`

Merge documents into a single PDF.

```js
const pdf = await mergeToPdf(['a.pdf', 'b.docx', 'c.doc']);
const pdf = await mergeToPdf([{ path: 'a.pdf', name: 'Part 1' }]);
const pdf = await mergeToPdf(files, { tempDir: '/tmp/custom' });
```

| Param | Type | Description |
|---|---|---|
| `files` | `Array<string \| {path, name?}>` | Paths or objects with optional display name |
| `options.tempDir` | `string` | Temp dir for intermediary files (default: `os.tmpdir()`) |

Supported input: `.pdf`, `.docx`, `.doc`

#### `mergeToDocx(files)` → `Promise<Buffer>`

Merge documents into a single DOCX. Extracts text from each file and combines with headings.

```js
const docx = await mergeToDocx(['report.pdf', 'notes.docx']);
```

### Page Operations

#### `rotatePage(filePath, pageIndex, angle?)` → `Promise<Buffer>`

Rotate a PDF page. Returns the modified PDF.

```js
const buf = await rotatePage('doc.pdf', 0, 90);   // 90° clockwise
const buf = await rotatePage('doc.pdf', 2, 180);   // flip upside down
```

#### `deletePage(filePath, pageIndex)` → `Promise<{buffer, pageCount}>`

Remove a page from a PDF. Returns the modified PDF and new page count.

```js
const { buffer, pageCount } = await deletePage('doc.pdf', 3);
```

#### `getPageCount(filePath)` → `Promise<number>`

```js
const pages = await getPageCount('doc.pdf'); // 24
```

### Text Extraction

#### `extractPdfText(filePath)` → `Promise<string>`

Extract all text from a PDF.

#### `extractDocxText(filePath)` → `Promise<string>`

Extract all text from a DOCX file.

## Use Cases

| Use Case | Example |
|---|---|
| **Document assembly** | Combine contracts, appendices, and cover pages |
| **Batch processing** | Merge hundreds of invoices into one file |
| **Build pipelines** | Generate combined docs from multiple sources |
| **Academic** | Merge papers, citations, and supplementary materials |
| **Legal** | Combine case files, exhibits, and filings |
| **Reporting** | Merge monthly reports into quarterly summaries |

## Part of DocMerge

This package powers [**DocMerge**](https://github.com/piyush28verma/doc_tool) — a free, open-source document combiner web app.

👉 **Try it live:** [doc-tool.onrender.com](https://doc-tool.onrender.com/)

## Contributing

Contributions welcome! See [CONTRIBUTING.md](https://github.com/piyush28verma/doc_tool/blob/main/CONTRIBUTING.md) for details.

```bash
git clone https://github.com/piyush28verma/doc_tool.git
cd doc_tool/packages/docmerge
npm install
npm test
```

## License

MIT © [Piyush Verma](https://github.com/piyush28verma)
