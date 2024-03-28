const api = require('express').Router()
const billController = require('../controllers/billController')
const authMiddleware = require('../middlewares/authMiddleware')
const use = require('../helper/utility').use

api.post('/bill', use(billController.create))

api.get('/bill/:userId', use(billController.getById))

module.exports = api 