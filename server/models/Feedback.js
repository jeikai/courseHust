const mongoose = require('mongoose')
const Schema = mongoose.Schema  

const FeedbackSchema = new Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    courseId: {type: mongoose.Schema.Types.ObjectId, ref: 'Course'},
    title: { type: String, required: true },
    content: { type: String, required: true },
    rating: {type: Number, require: true},
    date_created: Date
})

const Feedback = mongoose.model('Feedback', FeedbackSchema, 'feedbacks')
exports.schema = Feedback