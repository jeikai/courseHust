const uuid = require('uuid');
const fs = require('fs');
const multer = require('multer');

// Create a custom storage engine for Multer
const storage = multer.diskStorage({
    destination: '/temp/questions', // Temporary storage directory
    filename: (req, file, cb) => {
        // Extract the file extension from the original name
        const fileExtension = file.originalname.split('.').pop();

        // Create a custom file name with the extension
        const customFileName = `my-file-${uuid.v4()}.${fileExtension}`;

        // Pass the custom file name to Multer
        cb(null, customFileName);
    },
});

// Initialize Multer with the custom storage engine
const upload = multer({ storage });

// Middleware function to handle file uploads
const fileUploadMiddleware = (req, res, next) => {
    upload.single('file')(req, res, (err) => {
        if (err) {
            console.error('Error uploading file:', err);
            res.status(500).send('Error uploading file.');
        } else {
            // File uploaded successfully
            next(); // Proceed to the next middleware or route handler
        }
    });
};

module.exports = fileUploadMiddleware;