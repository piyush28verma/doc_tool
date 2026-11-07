const { mergeToPdf, mergeToDocx } = require("./merge");
const { rotatePage, deletePage, getPageCount } = require("./pages");
const { extractPdfText, extractDocxText } = require("./extract");

module.exports = {
  // Core merge operations
  mergeToPdf,
  mergeToDocx,

  // Page-level operations
  rotatePage,
  deletePage,
  getPageCount,

  // Text extraction
  extractPdfText,
  extractDocxText,
};

