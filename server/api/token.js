const api = require('express').Router()
const tokenController = require('../controllers/tokenController')
const authMiddleware = require('../middlewares/authMiddleware')
const use = require('../helper/utility').use

api.get('/auth', use(tokenController.auth))

api.post('/auth/:userId', authMiddleware.checkToken, use(tokenController.logout))

module.exports = api