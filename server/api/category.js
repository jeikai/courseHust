const api = require('express').Router()
const categoryController = require('../controllers/categoryController')
const authMiddleware = require('../middlewares/authMiddleware')
const use = require('../helper/utility').use

api.post('/category', authMiddleware.protectAdmin, use(categoryController.create));

api.get('/category', use(categoryController.get));

api.get('/category/number_question', use(categoryController.getWithNumberOfQuestion));

api.put('/category/:categoryId', authMiddleware.protectAdmin, use(categoryController.update))

api.delete('/category/:categoryId', authMiddleware.protectAdmin, use(categoryController.delete))

module.exports = api
