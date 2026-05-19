const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const PDFMerger = require("pdf-merger-js").default;
const { PDFDocument, degrees } = require("pdf-lib");
const mammoth = require("mammoth");
const PDFKit = require("pdfkit");
const { Document, Paragraph, TextRun, HeadingLevel, Packer } = require("docx");
const pdfjsLib = require("pdfjs-dist/legacy/build/pdf.js");

const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json());

const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

let filesMetadata = [];

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = uuidv4() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];
  const allowedExtensions = [".pdf", ".doc", ".docx"];
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedTypes.includes(file.mimetype) || allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF, DOC, and DOCX files are allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 },
});

app.post("/api/upload", upload.array("files", 20), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No files were uploaded" });
    }

    const uploadedFiles = [];

    for (const file of req.files) {
      const fileData = {
        id: uuidv4(),
        originalName: file.originalname,
        fileName: file.filename,
        filePath: file.path,
        fileSize: file.size,
        mimeType: file.mimetype,
        extension: path.extname(file.originalname).toLowerCase(),
        uploadedAt: new Date().toISOString(),
        pageCount: 1,
      };

      try {
        if (fileData.extension === ".pdf") {
          const pdfBytes = fs.readFileSync(fileData.filePath);
          const pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
          fileData.pageCount = pdfDoc.getPageCount();
        }
      } catch (err) {
        fileData.pageCount = 1;
      }

      filesMetadata.push(fileData);
      uploadedFiles.push(fileData);
    }

    res.json({
      message: `${uploadedFiles.length} file(s) uploaded successfully`,
      files: uploadedFiles,
    });
  } catch (error) {
    res.status(500).json({ error: "Upload failed: " + error.message });
  }
});

app.get("/api/files", (req, res) => {
  res.json({ files: filesMetadata });
});

app.get("/api/files/:id/download", (req, res) => {
  const file = filesMetadata.find((f) => f.id === req.params.id);
  if (!file) {
    return res.status(404).json({ error: "File not found" });
  }
  if (!fs.existsSync(file.filePath)) {
    return res.status(404).json({ error: "File no longer exists on disk" });
  }
  res.sendFile(file.filePath);
});

app.get("/api/files/:id/preview", async (req, res) => {
  const file = filesMetadata.find((f) => f.id === req.params.id);
  if (!file) {
    return res.status(404).json({ error: "File not found" });
  }

  try {
    if (file.extension === ".docx") {
      const result = await mammoth.convertToHtml({ path: file.filePath });
      res.json({ html: result.value, messages: result.messages });
    } else if (file.extension === ".doc") {
      res.json({
        html: "<p style='padding:20px;color:#666;'>DOC format preview is limited. The file will still be included in the merge.</p>",
        messages: [],
      });
    } else {
      res.status(400).json({ error: "Use /download for PDF files." });
    }
  } catch (error) {
    res.status(500).json({ error: "Preview failed: " + error.message });
  }
});

app.delete("/api/files/:id", (req, res) => {
  const fileIndex = filesMetadata.findIndex((f) => f.id === req.params.id);
  if (fileIndex === -1) {
    return res.status(404).json({ error: "File not found" });
  }

  const file = filesMetadata[fileIndex];
  if (fs.existsSync(file.filePath)) {
    fs.unlinkSync(file.filePath);
  }
  filesMetadata.splice(fileIndex, 1);

  res.json({ message: "File deleted successfully" });
});

app.post("/api/merge", async (req, res) => {
  try {
    const { fileIds, exportFormat = "pdf" } = req.body;

    if (!fileIds || fileIds.length === 0) {
      return res.status(400).json({ error: "No files specified for merging" });
    }

    const filesToMerge = fileIds
      .map((id) => filesMetadata.find((f) => f.id === id))
      .filter(Boolean);

    if (filesToMerge.length === 0) {
      return res.status(404).json({ error: "No valid files found" });
    }

    if (exportFormat === "docx") {
      const sections = [];

      for (const file of filesToMerge) {
        const children = [];

        children.push(new Paragraph({
          children: [new TextRun({ text: file.originalName, bold: true, size: 28 })],
          heading: HeadingLevel.HEADING_1,
          spacing: { after: 200 },
        }));

        let text = "";
        try {
          if (file.extension === ".docx") {
            const result = await mammoth.extractRawText({ path: file.filePath });
            text = result.value;
          } else if (file.extension === ".pdf") {
            text = await extractPdfText(file.filePath);
          } else if (file.extension === ".doc") {
            const buffer = fs.readFileSync(file.filePath);
            text = buffer.toString("utf8").replace(/[^\x20-\x7E\n\r\t]/g, "").replace(/\s{3,}/g, "\n").trim();
            if (text.length < 50) text = `[DOC document: ${file.originalName}]`;
          }
        } catch (e) {
          text = `[Could not extract text from ${file.originalName}]`;
        }

        const lines = text.split("\n");
        for (const line of lines) {
          if (line.trim() === "") {
            children.push(new Paragraph({ spacing: { after: 100 } }));
          } else {
            children.push(new Paragraph({
              children: [new TextRun({ text: line, size: 24 })],
              spacing: { after: 60 },
            }));
          }
        }

        sections.push({ children });
      }

      const doc = new Document({ sections });
      const docxBuffer = await Packer.toBuffer(doc);

      res.set({
        "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": 'attachment; filename="merged_document.docx"',
        "Content-Length": docxBuffer.length,
      });
      return res.send(docxBuffer);
    }

    const pdfPaths = [];
    const tempFiles = [];

    for (const file of filesToMerge) {
      if (file.extension === ".pdf") {
        pdfPaths.push(file.filePath);
      } else if (file.extension === ".docx") {
        const pdfPath = await convertDocxToPdf(file.filePath);
        pdfPaths.push(pdfPath);
        tempFiles.push(pdfPath);
      } else if (file.extension === ".doc") {
        const pdfPath = await convertDocToPdf(file.filePath, file.originalName);
        pdfPaths.push(pdfPath);
        tempFiles.push(pdfPath);
      }
    }

    const merger = new PDFMerger();
    for (const pdfPath of pdfPaths) {
      await merger.add(pdfPath);
    }

    const mergedFileName = `merged_${Date.now()}.pdf`;
    const mergedPath = path.join(uploadsDir, mergedFileName);
    await merger.save(mergedPath);

    const mergedBuffer = fs.readFileSync(mergedPath);

    tempFiles.forEach((p) => {
      try { fs.unlinkSync(p); } catch (e) {}
    });
    try { fs.unlinkSync(mergedPath); } catch (e) {}

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="merged_document.pdf"',
      "Content-Length": mergedBuffer.length,
    });
    res.send(mergedBuffer);
  } catch (error) {
    console.error("Merge error:", error);
    res.status(500).json({ error: "Merge failed: " + error.message });
  }
});

app.post("/api/rotate", async (req, res) => {
  try {
    const { fileId, pageIndex, rotationAngle } = req.body;

    const file = filesMetadata.find((f) => f.id === fileId);
    if (!file) return res.status(404).json({ error: "File not found" });
    if (file.extension !== ".pdf") return res.status(400).json({ error: "Rotation only works with PDF files" });

    const pdfBytes = fs.readFileSync(file.filePath);
    const pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
    const pages = pdfDoc.getPages();

    if (pageIndex < 0 || pageIndex >= pages.length) {
      return res.status(400).json({ error: "Invalid page index" });
    }

    const page = pages[pageIndex];
    const currentRotation = page.getRotation().angle;
    page.setRotation(degrees(currentRotation + rotationAngle));

    const modifiedBytes = await pdfDoc.save();
    fs.writeFileSync(file.filePath, Buffer.from(modifiedBytes));

    res.json({ message: "Page rotated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Rotation failed: " + error.message });
  }
});

app.post("/api/delete-page", async (req, res) => {
  try {
    const { fileId, pageIndex } = req.body;

    const file = filesMetadata.find((f) => f.id === fileId);
    if (!file) return res.status(404).json({ error: "File not found" });
    if (file.extension !== ".pdf") return res.status(400).json({ error: "Page deletion only works with PDF files" });

    const pdfBytes = fs.readFileSync(file.filePath);
    const pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });

    if (pdfDoc.getPageCount() <= 1) {
      return res.status(400).json({ error: "Cannot delete the only page. Delete the file instead." });
    }
    if (pageIndex < 0 || pageIndex >= pdfDoc.getPageCount()) {
      return res.status(400).json({ error: "Invalid page index" });
    }

    pdfDoc.removePage(pageIndex);
    const modifiedBytes = await pdfDoc.save();
    fs.writeFileSync(file.filePath, Buffer.from(modifiedBytes));

    file.pageCount = pdfDoc.getPageCount();

    res.json({ message: "Page deleted successfully", newPageCount: file.pageCount });
  } catch (error) {
    res.status(500).json({ error: "Page deletion failed: " + error.message });
  }
});

async function convertDocxToPdf(docxPath) {
  const result = await mammoth.extractRawText({ path: docxPath });
  const text = result.value;
  const outputPath = path.join(uploadsDir, `_converted_${uuidv4()}.pdf`);

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

async function convertDocToPdf(docPath, originalName) {
  const outputPath = path.join(uploadsDir, `_converted_${uuidv4()}.pdf`);

  return new Promise((resolve, reject) => {
    const doc = new PDFKit({ margin: 50 });
    const stream = fs.createWriteStream(outputPath);
    doc.pipe(stream);
    doc.fontSize(14).font("Helvetica-Bold");
    doc.text(originalName, { align: "center" });
    doc.moveDown();
    doc.fontSize(11).font("Helvetica");
    doc.text("This document was converted from DOC format. Some formatting may not be preserved.", { align: "center" });

    try {
      const buffer = fs.readFileSync(docPath);
      const rawText = buffer.toString("utf8").replace(/[^\x20-\x7E\n\r\t]/g, "").replace(/\s{3,}/g, "\n").trim();
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

async function extractPdfText(pdfPath) {
  const data = new Uint8Array(fs.readFileSync(pdfPath));
  const doc = await pdfjsLib.getDocument({ data, useSystemFonts: true }).promise;
  let fullText = "";
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items.map(item => item.str).join(" ");
    fullText += pageText + "\n";
  }
  return fullText.trim();
}

app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ error: "File is too large. Maximum size is 50MB." });
    }
    return res.status(400).json({ error: err.message });
  }
  if (err) return res.status(400).json({ error: err.message });
  next();
});

app.use(express.static(path.join(__dirname, "../frontend/dist")));

app.get("*", (req, res) => {
  const indexPath = path.join(__dirname, "../frontend/dist/index.html");
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).json({ error: "Not found" });
  }
});

const LISTEN_PORT = process.env.PORT || PORT;
app.listen(LISTEN_PORT, () => {
  console.log(`Server running on http://localhost:${LISTEN_PORT}`);
  console.log(`Uploads directory: ${uploadsDir}`);
});
