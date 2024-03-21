const api = require('express').Router()
const courseController = require('../controllers/courseController')
const authMiddleware = require('../middlewares/authMiddleware')
const use = require('../helper/utility').use

api.post('/course', authMiddleware.protectTeacher, use(courseController.create))

api.get('/course', use(courseController.getAll))

api.get('/course/category', use(courseController.getByCategory))

api.get('/course/title', use(courseController.getByTitle))

api.get('/course/:courseId', use(courseController.getById))


module.exports = api