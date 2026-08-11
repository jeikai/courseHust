const api = require('express').Router()
const calendarController = require('../controllers/calendarController')
const authMiddleware = require('../middlewares/authMiddleware')
const use = require('../helper/utility').use

api.post('/calendar', authMiddleware.protectInstructor, use(calendarController.create))
api.get('/calendar/:courseId', authMiddleware.protectAny, use(calendarController.getByCourseId))
api.get('/calendar/user/:userId', authMiddleware.protectAny, use(calendarController.getByUserId))
api.get('/calendar/check/:userId/:courseId', authMiddleware.protectAny, use(calendarController.checkCalendar))
api.put('/calendar/:calendarId', authMiddleware.protectInstructor, use(calendarController.update))
api.delete('/calendar/:calendarId', authMiddleware.protectInstructor, use(calendarController.delete))

module.exports = api