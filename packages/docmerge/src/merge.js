const fs = require("fs");
const path = require("path");
const PDFMerger = require("pdf-merger-js").default;
const { PDFDocument } = require("pdf-lib");
const mammoth = require("mammoth");
const PDFKit = require("pdfkit");
const { Document, Paragraph, TextRun, HeadingLevel, Packer } = require("docx");
const { extractPdfText, extractDocxText } = require("./extract");

/**
 * Merge multiple document files (PDF, DOCX, DOC) into a single PDF buffer.
 *
 * @param {Array<string|Buffer|{path: string, name?: string}>} files - File paths, buffers, or file objects to merge
 * @param {Object} [options] - Merge options
 * @param {string} [options.tempDir] - Temporary directory for intermediate files (defaults to os.tmpdir())
 * @returns {Promise<Buffer>} - The merged PDF as a Buffer
 *
 * @example
 * const { mergeToPdf } = require('docmerge');
 *
 * // Merge file paths
 * const pdfBuffer = await mergeToPdf(['doc1.pdf', 'report.docx', 'notes.pdf']);
 * fs.writeFileSync('merged.pdf', pdfBuffer);
 *
 * // Merge with named files
 * const pdfBuffer = await mergeToPdf([
 *   { path: 'doc1.pdf', name: 'Chapter 1' },
 *   { path: 'doc2.docx', name: 'Chapter 2' },
 * ]);
 */
async function mergeToPdf(files, options = {}) {
  if (!files || files.length === 0) {
    throw new Error("No files provided for merging");
  }

  const tempDir = options.tempDir || require("os").tmpdir();
  const pdfPaths = [];
  const tempFiles = [];

  for (const file of files) {
    const filePath = typeof file === "string" ? file : file.path;
    const ext = path.extname(filePath).toLowerCase();

    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    if (ext === ".pdf") {
      pdfPaths.push(filePath);
    } else if (ext === ".docx") {
      const pdfPath = await _convertDocxToPdf(filePath, tempDir);
      pdfPaths.push(pdfPath);
      tempFiles.push(pdfPath);
    } else if (ext === ".doc") {
      const name =
        typeof file === "object" && file.name
          ? file.name
          : path.basename(filePath);
      const pdfPath = await _convertDocToPdf(filePath, name, tempDir);
      pdfPaths.push(pdfPath);
      tempFiles.push(pdfPath);
    } else {
      throw new Error(`Unsupported file format: ${ext}`);
    }
  }

  const merger = new PDFMerger();
  for (const pdfPath of pdfPaths) {
    await merger.add(pdfPath);
  }

  const mergedFileName = `docmerge_${Date.now()}.pdf`;
  const mergedPath = path.join(tempDir, mergedFileName);
  await merger.save(mergedPath);

  const mergedBuffer = fs.readFileSync(mergedPath);

  // Cleanup temp files
  for (const p of [...tempFiles, mergedPath]) {
    try {
      fs.unlinkSync(p);
    } catch (e) {
      // ignore cleanup errors
    }
  }

  return mergedBuffer;
}

/**
 * Merge multiple document files (PDF, DOCX, DOC) into a single DOCX buffer.
 * Text is extracted from each file and combined into a structured DOCX document.
 *
 * @param {Array<string|{path: string, name?: string}>} files - File paths or file objects to merge
 * @returns {Promise<Buffer>} - The merged DOCX as a Buffer
 *
 * @example
 * const { mergeToDocx } = require('docmerge');
 *
 * const docxBuffer = await mergeToDocx(['doc1.pdf', 'report.docx']);
 * fs.writeFileSync('merged.docx', docxBuffer);
 */
async function mergeToDocx(files) {
  if (!files || files.length === 0) {
    throw new Error("No files provided for merging");
  }

  const sections = [];

  for (const file of files) {
    const filePath = typeof file === "string" ? file : file.path;
    const fileName =
      typeof file === "object" && file.name
        ? file.name
        : path.basename(filePath);
    const ext = path.extname(filePath).toLowerCase();

    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    const children = [];

    // Add file name as heading
    children.push(
      new Paragraph({
        children: [new TextRun({ text: fileName, bold: true, size: 28 })],
        heading: HeadingLevel.HEADING_1,
        spacing: { after: 200 },
      })
    );

    let text = "";
    try {
      if (ext === ".docx") {
        text = await extractDocxText(filePath);
      } else if (ext === ".pdf") {
        text = await extractPdfText(filePath);
      } else if (ext === ".doc") {
        const buffer = fs.readFileSync(filePath);
        text = buffer
          .toString("utf8")
          .replace(/[^\x20-\x7E\n\r\t]/g, "")
          .replace(/\s{3,}/g, "\n")
          .trim();
        if (text.length < 50) text = `[DOC document: ${fileName}]`;
      } else {
        throw new Error(`Unsupported file format: ${ext}`);
      }
    } catch (e) {
      text = `[Could not extract text from ${fileName}]`;
    }

    const lines = text.split("\n");
    for (const line of lines) {
      if (line.trim() === "") {
        children.push(new Paragraph({ spacing: { after: 100 } }));
      } else {
        children.push(
          new Paragraph({
            children: [new TextRun({ text: line, size: 24 })],
            spacing: { after: 60 },
          })
        );
      }
    }

    sections.push({ children });
  }

  const doc = new Document({ sections });
  return await Packer.toBuffer(doc);
}

/** @private */
async function _convertDocxToPdf(docxPath, tempDir) {
  const result = await mammoth.extractRawText({ path: docxPath });
  const text = result.value;
  const outputPath = path.join(tempDir, `docmerge_conv_${Date.now()}.pdf`);

  return new Promise((resolve, reject) => {
    const doc = new PDFKit({ margin: 50 });
    const stream = fs.createWriteStream(outputPath);
    doc.pipe(stream);
    doc.fontSize(12).font("Helvetica");

    const lines = text.split("\n");
    lines.forEach((line) => {
      if (line.trim() === "") {
        doc.moveDown(0.5);
      } else {
        doc.text(line, { align: "left" });
      }
    });

    doc.end();
    stream.on("finish", () => resolve(outputPath));
    stream.on("error", reject);
  });
}

/** @private */
async function _convertDocToPdf(docPath, originalName, tempDir) {
  const outputPath = path.join(tempDir, `docmerge_conv_${Date.now()}.pdf`);

  return new Promise((resolve, reject) => {
    const doc = new PDFKit({ margin: 50 });
    const stream = fs.createWriteStream(outputPath);
    doc.pipe(stream);
    doc.fontSize(14).font("Helvetica-Bold");
    doc.text(originalName, { align: "center" });
    doc.moveDown();
    doc.fontSize(11).font("Helvetica");

    try {
      const buffer = fs.readFileSync(docPath);
      const rawText = buffer
        .toString("utf8")
        .replace(/[^\x20-\x7E\n\r\t]/g, "")
        .replace(/\s{3,}/g, "\n")
        .trim();
      if (rawText.length > 50) {
        doc.moveDown();
        doc.text(rawText.substring(0, 5000), { align: "left" });
      }
    } catch (e) {
      doc.moveDown();
      doc.text("Could not extract text from this DOC file.");
    }

    doc.end();
    stream.on("finish", () => resolve(outputPath));
    stream.on("error", reject);
  });
}

module.exports = { mergeToPdf, mergeToDocx };

