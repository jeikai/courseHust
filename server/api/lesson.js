const api = require('express').Router();
const lessonController = require('../controllers/lessonController');
const authMiddleware = require('../middlewares/authMiddleware');
const use = require('../helper/utility').use;

api.post('/lesson', use(lessonController.create));
api.get('/lesson/:lessonId', use(lessonController.getById));
api.put('/lesson/:lessonId', use(lessonController.update));
api.delete('/lesson/:lessonId', use(lessonController.delete))
module.exports = api;
