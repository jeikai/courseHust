const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const crypto = require('crypto');
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  allowedFormats: ['mp4', 'jpg', 'png', 'pdf', 'docx'],
  params: async (req, file) => {
    if (file.mimetype.startsWith('video/')) {
      cloudinary.uploader.upload(file.path, {
        resource_type: "video",
        eager: [
          { width: 300, height: 300, crop: "pad", audio_codec: "none" },
          { width: 160, height: 100, crop: "crop", gravity: "south", audio_codec: "none" }],
        eager_async: true,
      }).then(result => console.log(result));
      return {
        resource_type: 'video',
        folder: 'course_HUST/videos'
      };
    } else if (file.mimetype === 'application/pdf') {
      // Cloudinary treats PDFs as an `image` resource under `auto`: it keeps
      // the .pdf extension and serves them inline (no forced download),
      // so browsers/iframes can render them directly.
      return {
        resource_type: 'auto',
        folder: 'course_HUST/document',
      };
    } else if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      // Office documents are always a `raw` resource in Cloudinary. Unlike
      // `image`, `raw` does NOT auto-append a format extension and defaults
      // to Content-Disposition: attachment with the random public_id as the
      // filename - so the delivered URL previously had no ".docx" at all,
      // which breaks both direct viewing and any URL-based viewer (e.g.
      // Office Online Viewer) that needs to see the extension to know how
      // to render it. Explicitly appending the original extension to
      // public_id is the documented Cloudinary workaround.
      const ext = (file.originalname.split('.').pop() || 'docx').toLowerCase();
      return {
        resource_type: 'raw',
        folder: 'course_HUST/document',
        public_id: `${crypto.randomUUID()}.${ext}`,
      };
    } else {
      return {
        folder: 'course_HUST/images',
      };
    } 
  },
});

const uploadCloud = multer({ storage });

module.exports = uploadCloud;
