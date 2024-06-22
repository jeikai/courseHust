const mongoose = require('mongoose')
const Schema = mongoose.Schema
const courseModel = require('./Course')
const ProcessSchema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    lessonId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }],
    quizScores: [{ quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' }, score: {type: Number} }],
    process: { type: Number, default: 0 },
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
            process: 0,
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
        return { error: err }
    }
};

exports.getByUserIdAndCourseId = async function (userId, courseId) {
    try {
        const process = await Process.findOne({ userId: userId, courseId: courseId })
        return process;
    } catch (error) {
        console.log(error)
        return { error: error }
    }
}

exports.getByCourseId = async function (courseId) {
    try {
        const process = await Process.find({ courseId: courseId })
        return process;
    } catch (error) {
        console.log(error)
        return { error: error }
    }
}

exports.getByUserId = async function (userId) {
    try {
        const process = await Process.find({ userId: userId }).populate('courseId')
            .populate({
                path: 'courseId',
                populate: [{
                    path: 'instructorId'
                }]
            })
        return process;
    } catch (error) {
        console.log(error)
        return { error: error }
    }
}

exports.updateLesson = async function (userId, courseId, lessonId) {
    try {
        const process = await Process.findOne({
            userId: userId,
            courseId: courseId
        })
        const existingLessonIndex = process.lessonId.indexOf(lessonId)
        if (existingLessonIndex !== -1) {
            console.log("existed")
            return process
        }
        const course = await courseModel.get({
            courseId: courseId
        })
        if (!process || !course) return { error: "not found" }
        let totalLesson = 0;
        course?.sections.forEach((section) => {
            totalLesson += section?.specs.length
        })
        const process_section = (((process?.lessonId.length + process?.quizScores.length + 1) / totalLesson) * 100).toFixed(2)

        process.lessonId.push(lessonId)
        process.process = process_section
        process.date_updated = new Date()
        process.markModified("lessonId")
        process.markModified("process")
        process.markModified("date_updated")
        await process.save()
        return process
    } catch (error) {
        console.log(error)
        return { error: error }
    }
}

exports.updateQuiz = async function (userId, courseId, quizId, score) {
    try {
        const process = await Process.findOne({
            userId: userId,
            courseId: courseId
        });

        if (!process) {
            return { error: "not found" };
        }

        const existingQuizIndex = process.quizScores.findIndex(quiz => quiz.quizId.toString() === quizId);
        if (existingQuizIndex !== -1) {
            console.log("Quiz already exists");
            return process;
        }

        const course = await courseModel.get({
            courseId: courseId
        });

        if (!course) {
            return { error: "Course not found" };
        }

        let totalLesson = 0;
        course.sections.forEach((section) => {
            totalLesson += section.specs.length;
        });

        const newQuizScore = { quizId: quizId, score: score };
        process.quizScores.push(newQuizScore);

        const processPercentage = (((process.lessonId.length + process.quizScores.length + 1) / totalLesson) * 100).toFixed(2);
        process.process = processPercentage;
        process.date_updated = new Date();

        process.markModified("quizScores");
        process.markModified("process");
        process.markModified("date_updated");

        await process.save();
        return process;
    } catch (error) {
        console.log(error);
        return { error: error };
    }
}
