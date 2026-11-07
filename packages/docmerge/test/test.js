/**
 * Basic smoke test for docmerge package.
 * Run: node test/test.js
 */

const assert = require("assert");
const path = require("path");

// Test that all exports exist and are functions
const docmerge = require("../src/index");

const expectedExports = [
  "mergeToPdf",
  "mergeToDocx",
  "rotatePage",
  "deletePage",
  "getPageCount",
  "extractPdfText",
  "extractDocxText",
];

console.log("Running docmerge tests...\n");

let passed = 0;
let failed = 0;

for (const name of expectedExports) {
  try {
    assert.strictEqual(
      typeof docmerge[name],
      "function",
      `${name} should be a function`
    );
    console.log(`  ✅ ${name} is exported as a function`);
    passed++;
  } catch (e) {
    console.log(`  ❌ ${name}: ${e.message}`);
    failed++;
  }
}

// Test error handling - mergeToPdf with no files
(async () => {
  try {
    await docmerge.mergeToPdf([]);
  } catch (e) {
    if (e.message === "No files provided for merging") {
      console.log("  ✅ mergeToPdf throws on empty array");
      passed++;
    } else {
      console.log(`  ❌ mergeToPdf wrong error: ${e.message}`);
      failed++;
    }
  }

  try {
    await docmerge.mergeToDocx([]);
  } catch (e) {
    if (e.message === "No files provided for merging") {
      console.log("  ✅ mergeToDocx throws on empty array");
      passed++;
    } else {
      console.log(`  ❌ mergeToDocx wrong error: ${e.message}`);
      failed++;
    }
  }

  // Test file not found
  try {
    await docmerge.mergeToPdf(["nonexistent.pdf"]);
  } catch (e) {
    if (e.message.includes("File not found")) {
      console.log("  ✅ mergeToPdf throws on missing file");
      passed++;
    } else {
      console.log(`  ❌ mergeToPdf wrong error: ${e.message}`);
      failed++;
    }
  }

  console.log(`\n${passed} passed, ${failed} failed\n`);
  process.exit(failed > 0 ? 1 : 0);
})();

