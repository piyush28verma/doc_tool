const fs = require("fs");
const mammoth = require("mammoth");
const pdfjsLib = require("pdfjs-dist/legacy/build/pdf.js");

/**
 * Extract all text content from a PDF file.
 *
 * @param {string} filePath - Path to the PDF file
 * @returns {Promise<string>} - Extracted text content
 *
 * @example
 * const { extractPdfText } = require('docmerge');
 * const text = await extractPdfText('document.pdf');
 * console.log(text);
 */
async function extractPdfText(filePath) {
  const data = new Uint8Array(fs.readFileSync(filePath));
  const doc = await pdfjsLib.getDocument({ data, useSystemFonts: true })
    .promise;
  let fullText = "";
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items.map((item) => item.str).join(" ");
    fullText += pageText + "\n";
  }
  return fullText.trim();
}

/**
 * Extract all text content from a DOCX file.
 *
 * @param {string} filePath - Path to the DOCX file
 * @returns {Promise<string>} - Extracted text content
 *
 * @example
 * const { extractDocxText } = require('docmerge');
 * const text = await extractDocxText('report.docx');
 * console.log(text);
 */
async function extractDocxText(filePath) {
  const result = await mammoth.extractRawText({ path: filePath });
  return result.value;
}

module.exports = { extractPdfText, extractDocxText };

