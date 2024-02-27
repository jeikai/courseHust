const api = require('express').Router()
const userController = require('../controllers/userController')
const use = require('../helper/utility').use
const validation = require('../middlewares/validation')

api.post('/user/register', validation.registerValidate, use(userController.register))

api.post('/user/login', use(userController.login))

api.get('/user/get/:userId', use(userController.get))


module.exports = api