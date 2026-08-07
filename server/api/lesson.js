const api = require('express').Router();
const lessonController = require('../controllers/lessonController');
const authMiddleware = require('../middlewares/authMiddleware');
const use = require('../helper/utility').use;

api.post('/lesson', authMiddleware.protectInstructor, use(lessonController.create));
api.get('/lesson/:lessonId', use(lessonController.getById));
api.put('/lesson/:lessonId', authMiddleware.protectInstructor, use(lessonController.update));
api.delete('/lesson/:lessonId', authMiddleware.protectInstructor, use(lessonController.delete))
module.exports = api;
