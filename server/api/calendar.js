const api = require('express').Router()
const calendarController = require('../controllers/calendarController')
const authMiddleware = require('../middlewares/authMiddleware')
const use = require('../helper/utility').use

api.post('/calendar', use(calendarController.create))
api.get('/calendar/:courseId', use(calendarController.getByCourseId))
api.get('/calendar/user/:userId', use(calendarController.getByUserId))
api.put('/calendar/:calendarId', use(calendarController.update))
api.delete('/calendar/:calendarId', use(calendarController.delete))

module.exports = api 