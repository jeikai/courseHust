const mongoose = require('mongoose')
const Schema = mongoose.Schema

const QuestionSchema = new Schema({
    question: { type: String, required: true },
    level: { type: String, enum: ['perception', 'comprehension', 'application', 'advanced application'], required: true, default: 'perception' },
    options: [{ type: String, default: '' }],
    answer: { type: String, default: '' },
    mark: { type: Number, default: 0 },
    date_created: Date,
    date_updated: Date
})

const Question = mongoose.model('Question', QuestionSchema, 'questions')
exports.schema = Question

exports.create = async function (data) {
    try {
        const checkExisted = await Question.findOne({ question: data.question })
        if (checkExisted) return { data: checkExisted }
        const questionData = {
            question: data.question,
            level: data.level,
            options: data.options,
            answer: data.answer,
            mark: data.mark,
            date_created: new Date(),
            date_updated: new Date()
        }
        const newQuestion = Question(questionData)
        await newQuestion.save()
        return { data: newQuestion }
    } catch (error) {
        return { error: error }
    }
}
