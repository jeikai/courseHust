const mongoose = require('mongoose')
const Schema = mongoose.Schema

const HistoryQuizSchema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' },
    listOfAnswer: [{ questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' }, answer: [{ type: String, default: '' }] }],
    correctCount: { type: Number, default: 0 },
    wrongCount: { type: Number, default: 0 },
    duration: { type: String, default: "00:00:00" },
    date_created: Date,
    date_updated: Date
})

const HistoryQuiz = mongoose.model('HistoryQuiz', HistoryQuizSchema, 'historyquizs')
exports.schema = HistoryQuiz

exports.create = async function (data) {
    try {
        const historyData = {
            userId: data.userId,
            quizId: data.quizId,
            listOfAnswer: data.listOfAnswer,
            correctCount: data.correctCount,
            wrongCount: data.wrongCount,
            duration: data.duration,
            date_created: new Date(),
            date_updated: new Date()
        }
        const newHistory = HistoryQuiz(historyData)
        await newHistory.save()
        return newHistory
    } catch (err) {
        return { error: err }
    }
}

exports.getByUserIdAndQuizId = async function (userId, quizId) {
    try {
        const history = await HistoryQuiz.find({ userId: userId, quizId: quizId })
            .populate({
                path: 'listOfAnswer.questionId',
                model: 'Question'
            }).populate("quizId");

        if (!history) {
            return null;
        }

        return history;
    } catch (err) {
        console.error(err);
        return { error: err }
    }
};

exports.getById = async function (id) {
    try {
        const history = await HistoryQuiz.findById(id)
            .populate({
                path: 'listOfAnswer.questionId',
                model: 'Question'
            }).populate("quizId");

        if (!history) {
            return null;
        }

        return history;
    } catch (err) {
        console.error(err);
        return { error: err }
    }
};


