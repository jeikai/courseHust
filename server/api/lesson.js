const api = require('express').Router()
const lessonController = require('../controllers/lessonController')
const authMiddleware = require('../middlewares/authMiddleware')
const use = require('../helper/utility').use

api.post('/lesson', use(lessonController.create))
api.get('/lesson/:lessonId', use(lessonController.getById))

module.exports = api 