const api = require('express').Router()
const courseController = require('../controllers/courseController')
const authMiddleware = require('../middlewares/authMiddleware')
const use = require('../helper/utility').use

api.post('/course', authMiddleware.protectInstructor, use(courseController.create))

api.get('/course', use(courseController.getAll))

api.get('/course/category', use(courseController.getByCategory))

api.get('/course/title', use(courseController.getByTitle))

api.get('/course/instructor/:instructorId', use(courseController.getByInstructorId))

api.get('/course/:courseId', use(courseController.getById))

api.put('/course/:courseId', use(courseController.update))

api.delete('/course/:courseId', use(courseController.delete))

module.exports = api 