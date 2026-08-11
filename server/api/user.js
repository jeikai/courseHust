const api = require('express').Router()
const userController = require('../controllers/userController')
const use = require('../helper/utility').use
const validation = require('../middlewares/validation')
const authMiddleware = require('../middlewares/authMiddleware')
const { forgotPasswordLimiter, verifyResetCodeLimiter } = require('../middlewares/rateLimiter')

api.post('/user/register', use(userController.register))

api.post('/user/login', validation.loginValidate, use(userController.login))

api.post('/user/forgot-password', forgotPasswordLimiter, validation.forgotPasswordValidate, use(userController.forgotPassword))

api.post('/user/verify-reset-code', verifyResetCodeLimiter, validation.verifyResetCodeValidate, use(userController.verifyResetCode))

api.post('/user/reset-password', forgotPasswordLimiter, validation.resetPasswordValidate, use(userController.resetPassword))

api.get('/user/get/:userId', authMiddleware.checkToken, use(userController.get))

api.get('/user/getDetail/:userId', use(userController.get))

api.get('/user/get', use(userController.getAll))

api.put('/user/update/:userId', authMiddleware.protectSelfOrAdmin, use(userController.update))

api.put('/user/:userId/verify', use(userController.updateVerify))

api.delete('/user/delete/:userId', authMiddleware.protectAdmin, use(userController.delete))

module.exports = api
