const mongoose = require('mongoose')
const Schema = mongoose.Schema
const sectionModel = require('./Section')

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
            title: data.title,
            ques: data.ques,
            date_created: new Date(),
            date_updated: new Date()
        }
        const newQuiz = Quiz(quizData)
        await newQuiz.save()
        await sectionModel.addSpec(data.sectionId, newQuiz._id, "lesson")
        return newQuiz
    } catch (error) {
        return { error: error }
    }
}
