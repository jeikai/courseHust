const api = require('express').Router()
const categoryController = require('../controllers/categoryController')
const authMiddleware = require('../middlewares/authMiddleware')
const use = require('../helper/utility').use

api.post('/category', authMiddleware.protectAdmin, use(categoryController.create))

module.exports = api