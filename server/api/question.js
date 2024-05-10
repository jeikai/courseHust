const api = require('express').Router()
const questionController = require('../controllers/questionController')
const authMiddleware = require('../middlewares/authMiddleware')
const use = require('../helper/utility').use

api.post('/question/:quizId', use(questionController.create))
module.exports = api