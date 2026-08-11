const calendarModel = require('../models/Calendar')
const courseModel = require('../models/Course')
const utility = require('../helper/utility')

exports.create = async function (req, res) {
    try {
        const data = req.body

        utility.validate(data, [
            'courseId', 'title', 'description', 'dayOfWeek',
            'time_start', 'time_end', 'day_start', 'day_end',
        ])

        const course = await courseModel.getRaw(data.courseId)
        if (!course) return res.status(404).json({ message: 'Course not found' })

        if (data.userRole !== 'admin' && course.instructorId?.toString() !== data.instructorId?.toString()) {
            return res.status(403).json({ message: 'You are not allowed to manage the schedule for this course' })
        }

        if (data.time_start >= data.time_end) {
            return res.status(400).json({ message: '"Start time" must be before "End time"' })
        }

        const dayStart = new Date(data.day_start)
        const dayEnd = new Date(data.day_end)
        if (isNaN(dayStart.getTime()) || isNaN(dayEnd.getTime())) {
            return res.status(400).json({ message: 'Invalid start/end date' })
        }
        if (dayStart > dayEnd) {
            return res.status(400).json({ message: '"Start date" must be before "End date"' })
        }

        const duplicate = await calendarModel.findDuplicate(data.courseId, data.dayOfWeek, data.time_start, data.time_end)
        if (duplicate) return res.status(409).json({ message: 'An identical schedule already exists for this course' })

        const newCalendar = await calendarModel.create({ ...data, day_start: dayStart, day_end: dayEnd })
        if (newCalendar.error) return res.status(500).json({ message: newCalendar.error.message || 'Failed to create schedule' })

        return res.status(201).json({ message: 'Create schedule successfully', data: newCalendar })
    } catch (error) {
        return res.status(error.status || 500).json({ message: error.message })
    }
}

exports.getByCourseId = async function (req, res) {
    try {
        const courseId = req.params.courseId
        const response = await calendarModel.getByCourseId(courseId)

        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

exports.getByUserId = async function (req, res) {
    try {
        const userId = req.params.userId
        const response = await calendarModel.getByUserId(userId)

        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

exports.checkCalendar = async function (req, res) {
    try {
        const { userId, courseId } = req.params;
        const responseUser = await calendarModel.getByUserId(userId);
        const responseCourse = await calendarModel.getByCourseId(courseId);

        const overlappingSchedules = [];
        if (!responseUser && !responseCourse) {
            for (const userSchedule of responseUser) {
                for (const courseSchedule of responseCourse) {
                    if (
                        userSchedule.dayOfWeek === courseSchedule.dayOfWeek &&
                        ((userSchedule.time_start >= courseSchedule.time_start && userSchedule.time_start < courseSchedule.time_end) ||
                            (userSchedule.time_end > courseSchedule.time_start && userSchedule.time_end <= courseSchedule.time_end) ||
                            (userSchedule.time_start <= courseSchedule.time_start && userSchedule.time_end >= courseSchedule.time_end))
                    ) {
                        overlappingSchedules.push(userSchedule);
                    }
                }
            }
        }

        return res.status(200).json(overlappingSchedules);
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: error.message });
    }
}

exports.update = async function (req, res) {
    try {
        const calendarId = req.params.calendarId
        const data = req.body

        const result = await calendarModel.update(calendarId, data)
        if (!result) return res.status(400).json({ message: "Failed to update" })

        return res.status(200).json(result)
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

exports.delete = async function (req, res) {
    try {
        const calendarId = req.params.calendarId;

        const response = await calendarModel.delete(calendarId)
        if (!response) return res.status(400).json({ message: "Failed to delete" })

        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}