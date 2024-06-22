const processModel = require('../models/Process')

exports.getByUserId = async (req, res) => {
    try {
        const userId = req.params.userId;
        const result = await processModel.getByUserId(userId);
        if (!result) {
            return res.status(400).json({ message: "No course found" })
        }
        return res.status(200).json({ data: result })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

exports.getByUserIdAndCourseId = async (req, res) => {
    try {
        const {userId, courseId }= req.params;
        const result = await processModel.getByUserIdAndCourseId(userId, courseId);
        if (!result) {
            return res.status(200).json({ message: "No course found" })
        }
        return res.status(200).json({ data: result })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

exports.getByCourseId = async (req, res) => {
    try {
        const { courseId }= req.params;
        const result = await processModel.getByCourseId(courseId);
        if (!result) {
            return res.status(200).json({ message: "No course found" })
        }
        return res.status(200).json({ data: result })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

exports.updateLesson = async (req, res) => {
    try {
        const { userId, courseId, lessonId } = req.body
        const result = await processModel.updateLesson(userId, courseId, lessonId);
        if (result.hasOwnProperty('error')) return res.status(500).json({ message: result.error })
        if (!result) {
            return res.status(400).json({ message: "No course found" })
        }
        return res.status(200).json({ data: result })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

exports.updateQuiz = async (req, res) => {
    try {
        const { userId, courseId, quizId, score } = req.body
        const result = await processModel.updateQuiz(userId, courseId, quizId, score);
        if (result.hasOwnProperty('error')) return res.status(500).json({ message: result.error })
        if (!result) {
            return res.status(400).json({ message: "No course found" })
        }
        return res.status(200).json({ data: result })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}
