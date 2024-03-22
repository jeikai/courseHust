const api = require('express').Router()
const enrollController = require('../controllers/enrollmentController')
const authMiddleware = require('../middlewares/authMiddleware')
const use = require('../helper/utility').use

api.post('/enrollment', authMiddleware.protectStudent, use(enrollController.create))

api.get('/enrollment/:userId', authMiddleware.protectStudent, use(enrollController.getById))

api.delete('/enrollment/:userId/:courseId', use(enrollController.delete))
module.exports = api