const mongoose = require('mongoose')
const Schema = mongoose.Schema
const sectionModel = require('./Section')
const { duration } = require('@mui/material')

const QuizSchema = new Schema({
    title: { type: String, required: true },
    duration: { type: String, default: '' },
    ques: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'Question'
    }],
    startTime: { type: Date, default: '' },
    endTime: { type: Date, default: '' },
    date_created: Date,
    date_updated: Date
})

const Quiz = mongoose.model('Quiz', QuizSchema, 'quizs')
exports.schema = Quiz

exports.create = async function (sectionId, data) {
    try {
        const quizData = {
            title: data.title,
            duration: data.duration,
            ques: data.ques,
            startTime: data.startTime || '',
            endTime: data.endTime || '',
            date_created: new Date(),
            date_updated: new Date()
        }
        const newQuiz = Quiz(quizData)
        await newQuiz.save()
        await sectionModel.addQuiz(sectionId, newQuiz._id, "quiz")
        return newQuiz
    } catch (error) {
        console.log(error)
        return { error: error }
    }
}

exports.getById = async function (data) {
    try {
        const quiz = await Quiz.findById(data).populate('ques');
        return quiz
    } catch (error) {
        return { error: error }
    }
}

exports.addQuiz = async function (quizId, questionId) {
    try {
        const quiz = await Quiz.findById(quizId)
        if (!quiz) return { error: "quiz not found" }

        quiz.ques.push(questionId)
        quiz.date_updated = new Date();
        quiz.markModified("ques")
        quiz.markModified("date_updated")
        await quiz.save()
    } catch (error) {
        return { error: error }
    }
}

exports.getByInstructorId = async function (quizId) {
    try {
        const quiz = await Quiz.findById(quizId).populate('ques');
        return quiz
    } catch (error) {
        return { error: error }
    }
}