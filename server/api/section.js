const api = require('express').Router()
const sectionController = require('../controllers/sectionController')
const authMiddleware = require('../middlewares/authMiddleware')
const use = require('../helper/utility').use

api.post('/section/:courseId', use(sectionController.create))

module.exports = api