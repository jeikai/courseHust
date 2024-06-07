const api = require('express').Router()
const favoriteController = require('../controllers/favoriteController')
const use = require('../helper/utility').use

api.post('/favorite', use(favoriteController.createOrDelete))
api.get('/favorite/:userId', use(favoriteController.getByUserId))
api.get('/favorite/check/:userId/:courseId', use(favoriteController.getByUserIdAndCourseId))

module.exports = api