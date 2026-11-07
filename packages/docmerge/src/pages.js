const fs = require("fs");
const { PDFDocument, degrees } = require("pdf-lib");

/**
 * Rotate a specific page in a PDF file.
 *
 * @param {string} filePath - Path to the PDF file
 * @param {number} pageIndex - Zero-based index of the page to rotate
 * @param {number} [angle=90] - Rotation angle in degrees (90, 180, 270)
 * @returns {Promise<Buffer>} - The modified PDF as a Buffer
 *
 * @example
 * const { rotatePage } = require('docmerge');
 *
 * const rotated = await rotatePage('document.pdf', 0, 90);
 * fs.writeFileSync('rotated.pdf', rotated);
 */
async function rotatePage(filePath, pageIndex, angle = 90) {
  const pdfBytes = fs.readFileSync(filePath);
  const pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
  const pages = pdfDoc.getPages();

  if (pageIndex < 0 || pageIndex >= pages.length) {
    throw new Error(
      `Invalid page index: ${pageIndex}. Document has ${pages.length} page(s).`
    );
  }

  const page = pages[pageIndex];
  const currentRotation = page.getRotation().angle;
  page.setRotation(degrees(currentRotation + angle));

  const modifiedBytes = await pdfDoc.save();
  return Buffer.from(modifiedBytes);
}

/**
 * Delete a specific page from a PDF file.
 *
 * @param {string} filePath - Path to the PDF file
 * @param {number} pageIndex - Zero-based index of the page to delete
 * @returns {Promise<{buffer: Buffer, pageCount: number}>} - The modified PDF and new page count
 *
 * @example
 * const { deletePage } = require('docmerge');
 *
 * const { buffer, pageCount } = await deletePage('document.pdf', 2);
 * fs.writeFileSync('modified.pdf', buffer);
 * console.log(`Document now has ${pageCount} pages`);
 */
async function deletePage(filePath, pageIndex) {
  const pdfBytes = fs.readFileSync(filePath);
  const pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });

  if (pdfDoc.getPageCount() <= 1) {
    throw new Error("Cannot delete the only page in the document.");
  }

  if (pageIndex < 0 || pageIndex >= pdfDoc.getPageCount()) {
    throw new Error(
      `Invalid page index: ${pageIndex}. Document has ${pdfDoc.getPageCount()} page(s).`
    );
  }

  pdfDoc.removePage(pageIndex);
  const modifiedBytes = await pdfDoc.save();

  return {
    buffer: Buffer.from(modifiedBytes),
    pageCount: pdfDoc.getPageCount(),
  };
}

/**
 * Get the page count of a PDF file.
 *
 * @param {string} filePath - Path to the PDF file
 * @returns {Promise<number>} - Number of pages
 *
 * @example
 * const { getPageCount } = require('docmerge');
 * const count = await getPageCount('document.pdf');
 * console.log(`Document has ${count} pages`);
 */
async function getPageCount(filePath) {
  const pdfBytes = fs.readFileSync(filePath);
  const pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
  return pdfDoc.getPageCount();
}

module.exports = { rotatePage, deletePage, getPageCount };

