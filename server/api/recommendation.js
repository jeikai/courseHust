const api = require('express').Router()
const use = require('../helper/utility').use
const recommendationController = require('../controllers/recommendationController')

api.post('/recommendation', use(recommendationController.example))

module.exports = api