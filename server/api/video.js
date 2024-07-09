const api = require('express').Router()
const videoController = require('../controllers/videoController')
const authMiddleware = require('../middlewares/authMiddleware')
const use = require('../helper/utility').use

api.post('/video', use(videoController.convert))

module.exports = api   