const api = require('express').Router()
const courseController = require('../controllers/courseController')
const authMiddleware = require('../middlewares/authMiddleware')
const use = require('../helper/utility').use

api.post('/course', authMiddleware.protectTeacher, use(courseController.create))

module.exports = api