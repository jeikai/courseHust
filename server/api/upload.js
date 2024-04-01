const api = require('express').Router()
const uploadCloud = require('../middlewares/upload')

api.post('/upload', uploadCloud.single('file'), (req, res, next) => {
    if (!req.file) {
      next(new Error('No file uploaded!'));
      return;
    }
    res.json({ file_url: req.file.path });
  });

module.exports = api