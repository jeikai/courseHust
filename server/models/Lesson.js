const mongoose = require('mongoose')
const Schema = mongoose.Schema

const LessonSchema = new Schema({
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    title: { type: String, required: true },
    content: { type: String, required: true },
    videoURL: { type: String, default: '' },
    docURL: { type: String, default: '' },
    order: { type: Number, required: true },
    duration: { type: Number, required: true },
    date_created: Date,
    date_updated: Date
})

const Lesson = mongoose.model('Lesson', LessonSchema, 'lessons')
exports.schema = Lesson

