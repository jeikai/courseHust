const api = require('express').Router()
const HistoryQuizController = require('../controllers/historyQuizController')
const use = require('../helper/utility').use

api.get('/historyquiz/:userId/:quizId', use(HistoryQuizController.getByUserIdAndQuizId))

api.post('/historyquiz', use(HistoryQuizController.create))

api.get('/historyquiz/:id', use(HistoryQuizController.getById))

module.exports = api   