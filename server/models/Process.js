const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ProcessSchema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    lessonId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }],
    quizScores: [{ quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' }, score: Number }],
    date_created: Date,
    date_updated: Date
})

const Process = mongoose.model('Process', ProcessSchema, 'process')
exports.schema = Process

exports.create = async function (data) {
    try {
        const lessonData = { 
            userId: data.userId,
            courseId: data.courseId,
            lessonId: [],
            quizScores: [],
            date_created: new Date(),
            date_updated: new Date()
        }
        const newLesson = Process(lessonData)
        await newLesson.save()
        return newLesson
    } catch (err) {
        return { error: err }
    }
}

exports.getById = async function (id) {
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error('Invalid lesson ID');
        }

        const lesson = await Process.findById(id);
        if (!lesson) {
            return null;
        }

        return lesson;
    } catch (err) {
        console.error(err);  
        throw err;        
    }
};