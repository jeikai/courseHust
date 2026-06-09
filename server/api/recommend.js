const api = require('express').Router()
const recommendationController = require('../controllers/recommendationController')
const use = require('../helper/utility').use

api.get('/recommend/:userId', use(recommendationController.recommend))

module.exports = api