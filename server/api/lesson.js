const api = require('express').Router();
const lessonController = require('../controllers/lessonController');
const authMiddleware = require('../middlewares/authMiddleware');
const use = require('../helper/utility').use;

api.post('/lesson', authMiddleware.protectInstructor, use(lessonController.create));
// Lesson content (including the document/video URL) must only go to an
// enrolled/purchased student or staff previewing their own course - it was
// previously unauthenticated, so anyone who knew or guessed a lessonId could
// fetch paid course material for free.
api.get('/lesson/:lessonId', authMiddleware.protectAny, use(lessonController.getById));
api.put('/lesson/:lessonId', authMiddleware.protectInstructor, use(lessonController.update));
api.delete('/lesson/:lessonId', authMiddleware.protectInstructor, use(lessonController.delete))
module.exports = api;
