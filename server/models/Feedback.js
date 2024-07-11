const mongoose = require('mongoose')
const Schema = mongoose.Schema
const courseModel = require('./Course')
const FeedbackSchema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    content: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5, default: 1 },
    date_created: Date
})

const Feedback = mongoose.model('Feedback', FeedbackSchema, 'feedbacks')
exports.schema = Feedback

exports.create = async function (data) {
    try {
        const newFeedback = new Feedback({
            userId: data.userId,
            courseId: data.courseId,
            content: data.content,
            rating: data.rating,
            date_created: new Date(),
        });
        await newFeedback.save();

        const feedbacks = await Feedback.find({ courseId: data.courseId });

        const averageRating = feedbacks.reduce((acc, feedback) => acc + feedback.rating, 0) / feedbacks.length;

        const roundedAverageRating = parseFloat(averageRating.toFixed(1));

        await courseModel.update(data.courseId, { rating: roundedAverageRating });

        return newFeedback;
    } catch (err) {
        console.log(err)
        return { error: err.toString() };
    }
};

exports.getByCourseId = async function (courseId) {
    try {
        const result = await Feedback.find({ courseId }).populate('userId');
        return result;
    } catch (err) {
        return { error: err };
    }
}

exports.get = async function () {
    try {
        const result = await Feedback.find();
        return result;
    } catch (err) {
        return { error: err };
    }
}

exports.getByUserId = async function (userId) {
    try {
        const result = await Feedback.find({ userId }).populate('userId');
        return result;
    } catch (err) {
        return { error: err };
    }
}