const api = require('express').Router()
const processController = require('../controllers/processController')
const use = require('../helper/utility').use

api.get('/process/:userId', use(processController.getByUserId))

api.get('/process/check/:userId/:courseId', use(processController.getByUserIdAndCourseId))

api.get('/process/course/:courseId', use(processController.getByCourseId))

api.put('/process/lesson', use(processController.updateLesson))

api.put('/process/quiz', use(processController.updateQuiz))
module.exports = api   