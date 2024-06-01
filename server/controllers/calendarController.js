const { func } = require('joi')
const calendarModel = require('../models/Calendar')

exports.create = async function (req, res) {
    try {
        const data = req.body

        const newCalendar = await calendarModel.create(data)
        if (newCalendar.hasOwnProperty('error')) return res.status(500).json({ message: newCalendar.error })

        return res.status(200).json({ message: "Create schedule successfully", data: newCalendar })
    } catch (error) {
        return res.status(500).json({ message: error.message })
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

        return res.status(200).json(overlappingSchedules);
    } catch (error) {
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