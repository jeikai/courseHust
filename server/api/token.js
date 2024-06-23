const api = require('express').Router()
const tokenController = require('../controllers/tokenController')
const authMiddleware = require('../middlewares/authMiddleware')
const use = require('../helper/utility').use

api.get('/auth', use(tokenController.auth));
api.post('/auth/logout/:userId', authMiddleware.checkToken, use(tokenController.logout));
api.post('/auth/refresh', use(tokenController.refresh));

module.exports = api