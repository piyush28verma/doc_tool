/**
 * DocMerge - Merge, rotate, and manipulate PDF and DOCX documents in Node.js
 */

/**
 * Merge multiple document files into a single PDF buffer.
 * Supports PDF, DOCX, and DOC input files.
 */
export function mergeToPdf(
  files: Array<string | { path: string; name?: string }>,
  options?: { tempDir?: string }
): Promise<Buffer>;

/**
 * Merge multiple document files into a single DOCX buffer.
 * Text is extracted from each file and combined into a structured DOCX document.
 */
export function mergeToDocx(
  files: Array<string | { path: string; name?: string }>
): Promise<Buffer>;

/**
 * Rotate a specific page in a PDF file.
 * @param filePath - Path to the PDF file
 * @param pageIndex - Zero-based index of the page to rotate
 * @param angle - Rotation angle in degrees (default: 90)
 * @returns The modified PDF as a Buffer
 */
export function rotatePage(
  filePath: string,
  pageIndex: number,
  angle?: number
): Promise<Buffer>;

/**
 * Delete a specific page from a PDF file.
 * @param filePath - Path to the PDF file
 * @param pageIndex - Zero-based index of the page to delete
 * @returns The modified PDF buffer and new page count
 */
export function deletePage(
  filePath: string,
  pageIndex: number
): Promise<{ buffer: Buffer; pageCount: number }>;

/**
 * Get the page count of a PDF file.
 */
export function getPageCount(filePath: string): Promise<number>;

/**
 * Extract all text content from a PDF file.
 */
export function extractPdfText(filePath: string): Promise<string>;

/**
 * Extract all text content from a DOCX file.
 */
export function extractDocxText(filePath: string): Promise<string>;

