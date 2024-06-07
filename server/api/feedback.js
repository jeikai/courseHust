const api = require('express').Router()
const feedbackController = require('../controllers/feedbackController')
const use = require('../helper/utility').use

api.post('/feedback', use(feedbackController.create))
api.get('/feedback/:courseId', use(feedbackController.getByCourseId))

module.exports = api