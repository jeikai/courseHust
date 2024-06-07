const feedbackModel = require('../models/Feedback')

exports.create = async function (req, res) {
    try {
        const data = req.body

        const newFeedBack = await feedbackModel.create(data)
        if (newFeedBack.hasOwnProperty('error')) return res.status(500).json({ message: newFeedBack.error })

        return res.status(200).json({ message: "Add comment successfully", data: newFeedBack })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: error.message })
    }
}

exports.getByCourseId = async function (req, res) {
    try {
        const courseId = req.params.courseId
        const response = await feedbackModel.getByCourseId(courseId)

        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}