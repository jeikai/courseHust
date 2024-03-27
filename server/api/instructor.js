const api = require('express').Router();
const authMiddleware = require('../middlewares/authMiddleware');
const instructorController = require('../controllers/instructorController');
const fileUploadMiddleware = require('../middlewares/fileUploadMiddleware');
const use = require('../helper/utility').use;

api.post('/instructor/upload-questions', fileUploadMiddleware, use(instructorController.postQuestions));

module.exports = api; 