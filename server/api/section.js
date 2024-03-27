const api = require('express').Router()
const sectionController = require('../controllers/sectionController')
const authMiddleware = require('../middlewares/authMiddleware')
const use = require('../helper/utility').use

api.post('/section/:courseId', use(sectionController.create))

api.get('/section', use(sectionController.getById))

module.exports = api