const api = require('express').Router();
const uploadCloud = require('../middlewares/upload');
const { getVideoDurationInSeconds } = require('get-video-duration');

api.post('/upload', uploadCloud.single('file'), async (req, res, next) => {
  // Check for upload errors
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  const isVideo = req.file.path.match(/mp4$/)
  if(isVideo) {
    let duration
    await getVideoDurationInSeconds(req.file.path)
      .then((response) =>{
        duration = response
      })
    return res.json({ file_url: req.file.path, duration: duration})
  }
  return res.json({ file_url: req.file.path });
});

module.exports = api;
