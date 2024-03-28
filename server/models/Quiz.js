const mongoose = require('mongoose')
const Schema = mongoose.Schema

const QuizSchema = new Schema({
    title: { type: String, required: true },
    ques: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'Question'
    }],
    date_created: Date,
    date_updated: Date
})

const Quiz = mongoose.model('Quiz', QuizSchema, 'quizs')
exports.schema = Quiz

exports.create = async function (data) {
    try {
        const quizData = {
            title: data.title
        }
    } catch (error) {
        return { error: error }
    }
}
