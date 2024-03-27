const mongoose = require('mongoose')
const Schema = mongoose.Schema

const LessonSchema = new Schema({
    key: {type: String, required: true},
    title: { type: String, required: true },
    content: { type: String, required: true },
    videoURL: { type: String, required: true },
    docURL: { type: String, required: true },
    duration: { type: Number, required: true },
    date_created: Date,
    date_updated: Date
})

const Lesson = mongoose.model('Lesson', LessonSchema, 'lessons')
exports.schema = Lesson