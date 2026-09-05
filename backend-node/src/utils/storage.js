/**
 * Storage abstraction.
 * Phase 1: local disk under UPLOAD_DIR / OUTPUT_DIR.
 * Phase 2+: swap with S3 here without touching business logic.
 */
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const UPLOAD_DIR = path.resolve(process.env.UPLOAD_DIR || '/tmp/doclyn/inputs');
const OUTPUT_DIR = path.resolve(process.env.OUTPUT_DIR || '/tmp/doclyn/outputs');

fs.mkdirSync(UPLOAD_DIR, { recursive: true });
fs.mkdirSync(OUTPUT_DIR, { recursive: true });

function saveUpload(buffer, originalName) {
  const fileId = uuidv4();
  const fileName = `${fileId}.pdf`;
  const fullPath = path.join(UPLOAD_DIR, fileName);
  fs.writeFileSync(fullPath, buffer);
  return { fileId, fullPath, fileName };
}

function getUploadPath(fileId) {
  const candidate = path.join(UPLOAD_DIR, `${fileId}.pdf`);
  // Path traversal guard
  if (!candidate.startsWith(UPLOAD_DIR + path.sep)) {
    throw new Error('Invalid file id');
  }
  return candidate;
}

function getOutputPath(fileName) {
  // Prevent path traversal on output names from Python.
  if (fileName.includes('/') || fileName.includes('\\') || fileName.includes('..')) {
    throw new Error('Invalid output filename');
  }
  return path.join(OUTPUT_DIR, fileName);
}

function streamFile(filePath, res) {
  fs.createReadStream(filePath).pipe(res);
}

function removeIfExists(filePath) {
  try {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  } catch (e) {
    // best-effort cleanup
  }
}

module.exports = {
  UPLOAD_DIR,
  OUTPUT_DIR,
  saveUpload,
  getUploadPath,
  getOutputPath,
  streamFile,
  removeIfExists,
};