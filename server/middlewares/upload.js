const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
require('dotenv').config()

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary,
  allowedFormats: ['mp4', 'jpg', 'png', 'pdf','docx'],
  params: async (req, file) => {
    // Kiểm tra nếu là video
    if (file.mimetype.startsWith('video/')) {
      cloudinary.uploader.upload(file.path, {
        resource_type: "video",
        eager: [
          { width: 300, height: 300, crop: "pad", audio_codec: "none" }, 
          { width: 160, height: 100, crop: "crop", gravity: "south", audio_codec: "none" } ],                                   
        eager_async: true,
      }).then(result=>console.log(result));
      return {
        resource_type: 'video',
        folder: 'course_HUST/videos'
      };
    } else {
      return {
        folder: 'course_HUST/images'
      };
    }
  }
});

const uploadCloud = multer({ storage });

module.exports = uploadCloud;
