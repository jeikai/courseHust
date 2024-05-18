const api = require('express').Router()
const quizController = require('../controllers/quizController')
const authMiddleware = require('../middlewares/authMiddleware')
const use = require('../helper/utility').use

api.get('/quiz/:quizId', use(quizController.getById))

api.get('/quiz/instructor/:instructorId', use(quizController.getByInstructorId))

api.post('/quiz/:sectionId', use(quizController.create))
module.exports = api