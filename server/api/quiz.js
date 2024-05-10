const api = require('express').Router()
const quizController = require('../controllers/quizController')
const authMiddleware = require('../middlewares/authMiddleware')
const use = require('../helper/utility').use

api.get('/quiz/:quizId', use(quizController.getById))

module.exports = api