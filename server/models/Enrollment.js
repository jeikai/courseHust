const { func } = require('joi')
const mongoose = require('mongoose')
const Schema = mongoose.Schema
// bảng này dành cho cart ( giỏ hàng )
const EnrollmentSchema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    date_created: Date,
    date_updated: Date
}) 

const Enrollment = mongoose.model('Enrollment', EnrollmentSchema, 'enrollments')
exports.schema = Enrollment

exports.create = async function (data) {
    try {
        const checkEnroll = await Enrollment.findOne({
            userId: data.userId,
            courseId: data.courseId
        })
        if (checkEnroll) return { error: 'Course has been already added' }
        const enrollData = {
            userId: data.userId,
            courseId: data.courseId,
            date_created: new Date(),
            date_updated: new Date()
        }
        const newEnrollment = Enrollment(enrollData)
        await newEnrollment.save()
        return newEnrollment
    } catch (error) {
        return { error: error }
    }
}

exports.getById = async function (data) {
    try {
        const enrollments = await Enrollment.find({ userId: data }).populate('courseId');
        return enrollments
    } catch (error) {
        return { error: error }
    }
}

exports.delete = async function (userId, courseId) {
    try {
        const result = await Enrollment.findOneAndDelete({ userId: userId, courseId: courseId })
        return result
    } catch (error) {
        return { error: error }
    }
}