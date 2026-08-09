const api = require('express').Router();
const uploadCloud = require('../middlewares/upload');
const { getVideoDurationInSeconds } = require('get-video-duration');
const use = require('../helper/utility').use;

api.post('/upload', function (req, res, next) {
  uploadCloud.single('file')(req, res, function (err) {
    if (err) {
      // Multer/Cloudinary rejections (unsupported type, invalid file, etc.)
      // are client input errors, not server failures.
      return res.status(err.http_code || 400).json({ message: err.message || 'Upload failed' });
    }
    next();
  });
}, use(async (req, res) => {
  // Check for upload errors
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  console.log('[upload] file stored:', {
    resource_type: req.file.resource_type,
    format: req.file.format,
    original_filename: req.file.originalname,
    mimetype: req.file.mimetype,
    bytes: req.file.size,
  });

  // originalName/mimeType let the frontend show a proper filename and pick
  // the right viewer even for resource types (raw) whose delivery URL alone
  // doesn't reliably carry that information.
  const metadata = {
    originalName: req.file.originalname,
    mimeType: req.file.mimetype,
  };

  const isVideo = req.file.path.match(/mp4$/)
  if (isVideo) {
    // The file is already uploaded to Cloudinary at this point (req.file.path
    // is the live URL). Probing its duration is best-effort enrichment - a
    // transient DNS/network failure reaching Cloudinary from ffprobe must not
    // fail the whole upload and strand an already-uploaded file.
    try {
      const duration = await getVideoDurationInSeconds(req.file.path)
      return res.json({ file_url: req.file.path, duration, ...metadata })
    } catch (err) {
      console.error('Failed to read video duration for', req.file.path, err.message)
      return res.json({ file_url: req.file.path, ...metadata })
    }
  }
  return res.json({ file_url: req.file.path, ...metadata });
}));

module.exports = api;
