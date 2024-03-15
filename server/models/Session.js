const mongoose = require('mongoose')
const Schema = mongoose.Schema

const SessionSchema = new Schema({
    courseId: {type: mongoose.Schema.Types.ObjectId, ref: 'Course'},
    title: { type: String, required: true },
    content: { type: String, required: true },
    key: { type: String, required: true },
    date_created: Date,
    date_updated: Date
})

const Session = mongoose.model('Session', SessionSchema, 'sessions')
exports.schema = Session