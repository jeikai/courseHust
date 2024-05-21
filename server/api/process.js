const api = require('express').Router()
const processController = require('../controllers/processController')
const use = require('../helper/utility').use

api.get('/process/:userId', use(processController.getByUserId))

module.exports = api  