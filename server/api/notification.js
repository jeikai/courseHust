const api = require('express').Router()
const notificationController = require('../controllers/notificationController')
const authMiddleware = require('../middlewares/authMiddleware')
const use = require('../helper/utility').use

api.post('/notification', use(notificationController.create))
api.get('/notification/:userId', use(notificationController.getByUserId))

module.exports = api