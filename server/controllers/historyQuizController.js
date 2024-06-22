const historyQuizModel = require('../models/HistoryQuiz')

exports.create = async (req, res) => {
    try {
        const data = req.body;
        const result = await historyQuizModel.create(data);
        if (!result) {
            return res.status(400).json({ message: "No quiz found" })
        }
        return res.status(200).json({ data: result })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

exports.getByUserIdAndQuizId = async (req, res) => {
    try {
        const { userId, quizId } = req.params;
        const result = await historyQuizModel.getByUserIdAndQuizId(userId, quizId);
        if (!result) {
            return res.status(200).json({ message: "No quiz found" })
        }
        return res.status(200).json({ data: result })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

exports.getById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await historyQuizModel.getById(id);
        if (!result) {
            return res.status(200).json({ message: "No quiz found" })
        }
        return res.status(200).json({ data: result })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}