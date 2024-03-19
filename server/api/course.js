const api = require('express').Router()
const authMiddleware = require('../middlewares/authMiddleware')
const use = require('../helper/utility').use
const courseController = require('../controllers/courseController')

api.post('/course/create', authMiddleware.protectTeacher, use(courseController.createCourse))

module.exports = api