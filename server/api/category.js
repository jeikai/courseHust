const api = require('express').Router()
const categoryController = require('../controllers/categoryController')
const authMiddleware = require('../middlewares/authMiddleware')
const use = require('../helper/utility').use

api.post('/category', authMiddleware.protectAdmin, use(categoryController.create))
api.get('/category', use(categoryController.get))

// api.get('/category', use(categoryController.get))

api.put('/category/:categoryId', use(categoryController.update))

api.delete('/category/:categoryId', use(categoryController.delete))

module.exports = api

