const api = require('express').Router()
const userController = require('../controllers/userController')
const use = require('../helper/utility').use
const validation = require('../middlewares/validation')
const authMiddleware = require('../middlewares/authMiddleware')

api.post('/user/register', use(userController.register))

api.post('/user/login', validation.loginValidate, use(userController.login))

api.get('/user/get/:userId', authMiddleware.checkToken, use(userController.get))

api.get('/user/getDetail/:userId', use(userController.get))

api.get('/user/get', use(userController.getAll))

api.put('/user/update/:userId', authMiddleware.checkToken, use(userController.update))

api.put('/user/:userId/verify', use(userController.updateVerify))

api.delete('/user/delete/:userId', authMiddleware.protectAdmin, use(userController.delete))

module.exports = api
