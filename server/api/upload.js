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
  const isVideo = req.file.path.match(/mp4$/)
  if(isVideo) {
    const duration = await getVideoDurationInSeconds(req.file.path)
    return res.json({ file_url: req.file.path, duration: duration})
  }
  return res.json({ file_url: req.file.path });
}));

module.exports = api;
