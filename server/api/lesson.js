const api = require('express').Router()
const use = require('../helper/utility').use
const lessonController = require('../controllers/lessonController')

api.post('/lesson/create', use(lessonController.createLesson))

module.exports = api