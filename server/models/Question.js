const mongoose = require('mongoose')
const Schema = mongoose.Schema

const QuestionSchema = new Schema({
    question: { type: String, required: true },
    level: { type: String, enum: ['perception', 'comprehension', 'application', 'advanced application'], required: true, default: 'perception' },
    options: [{ type: String, default: '' }],
    answer: { type: String, default: '' },
    date_created: Date,
    date_updated: Date
})

const Question = mongoose.model('Question', QuestionSchema, 'questions')
exports.schema = Question

exports.create = async function (data) {
    try {
        const checkExisted = await Question.findOne({ question: data.question })
        if (checkExisted) return { error: 'Question has already existed!' }
        const questionData = {
            question: data.question,
            level: data.level,
            options: data.options,
            answer: data.answer,
            date_created: new Date(),
            date_updated: new Date()
        }
        const newQuestion = Question(questionData)
        await newQuestion.save()
        return newQuestion
    } catch (error) {
        return { error: error }
    }
}
