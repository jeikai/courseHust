const api = require('express').Router()
const subCategoryController = require('../controllers/subCategoryController')
const authMiddleware = require('../middlewares/authMiddleware')
const use = require('../helper/utility').use

api.post('/subcategory/:categoryId', use(subCategoryController.create))
api.get('/subcategory', use(subCategoryController.get))
api.put('/subcategory/:subcategoryId', use(subCategoryController.update))
module.exports = api
