const enrollmentModel = require('../models/Enrollment')

exports.create = async function (req, res) {
    try {
        const data = req.body
        const newEnrollment = await enrollmentModel.create(data)
        if (newEnrollment.hasOwnProperty('error')) return res.status(500).json({ message: newEnrollment.error })

        return res.status(200).json({ message: "Course has been added to cart successfully", data: newEnrollment })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
} 

exports.getById = async function (req, res) { 
    try {
        const userId = req.params.userId
        const result = await enrollmentModel.getById(userId)
        if (result.error) return res.status(400).json({ message: "Failed to find" })
        return res.status(200).json(result)
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

exports.delete = async function (req, res) {
    try {
        const { userId, courseId } = req.params
        const result = await enrollmentModel.delete(userId, courseId)
        if (!result) return res.status(400).json({ message: "Failed to delete" })
        return res.status(200).json(result)
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}