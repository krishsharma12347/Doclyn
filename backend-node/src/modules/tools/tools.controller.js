/**
 * Tools HTTP layer.
 * Translates req/res into service calls.
 */
const service = require('./tools.service');
const validator = require('./tools.validator');

function asyncHandler(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}

const merge = asyncHandler(async (req, res) => {
  validator.validateMerge(req.body);
  const result = await service.merge({
    fileIds: req.body.file_ids,
    ownerId: req.user.id,
  });
  return res.status(200).json({
    success: true,
    data: result,
    message: 'Files merged successfully',
  });
});

const split = asyncHandler(async (req, res) => {
  validator.validateSplit(req.body);
  // FIX: Python's split endpoint expects a single page-range string like
  // "1-3,5", not an array. The old code sent `page_ranges` (an array) which
  // never matched what the Python service actually parses.
  const result = await service.split({
    fileId: req.body.file_id,
    pages: req.body.pages,
    ownerId: req.user.id,
  });
  return res.status(200).json({
    success: true,
    data: result,
    message: 'File split successfully',
  });
});

const compress = asyncHandler(async (req, res) => {
  validator.validateCompress(req.body);
  // FIX: `level` was never read from the request body before, so every
  // compress call silently used Python's default regardless of what the
  // user asked for.
  const result = await service.compress({
    fileId: req.body.file_id,
    level: req.body.level,
    ownerId: req.user.id,
  });
  return res.status(200).json({
    success: true,
    data: result,
    message: 'File compressed successfully',
  });
});

module.exports = {
  merge,
  split,
  compress,
};