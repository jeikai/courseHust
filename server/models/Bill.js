const mongoose = require('mongoose')
const Enrollment = require('../models/Enrollment')
const Schema = mongoose.Schema
// bảng này dành cho hoá đơn
const BillSchema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    listOfCourse: [{type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
    price: { type: Number },
    date_created: Date,
    date_updated: Date
})

const Bill = mongoose.model('Bill', BillSchema, 'bills')
exports.schema = Bill

exports.create = async function (data) {
    try {
        const enrollments = await Enrollment.getById(data.userId);
        if (!enrollments.length) {
            return { error: "Không tìm thấy khóa học nào cho người dùng này." };
        }

        const totalPrice = enrollments.reduce((acc, enrollment) => {
            const coursePrice = enrollment.courseId.price;
            return acc + coursePrice;
        }, 0);
        const courseIds = enrollments.map(enrollment => enrollment.courseId._id);
        enrollments.forEach((enrollment) => {
            Enrollment.delete(enrollment.userId, enrollment.courseId._id)
        })
        const billData = {
            userId: data.userId,
            listOfCourse: courseIds,
            price: totalPrice,
            date_created: new Date(),
            date_updated: new Date()
        }
        const newBill = Bill(billData)
        await newBill.save()
        return newBill
    } catch (error) {
        return { error: error }
    }
}

exports.getById = async function (data) {
    try {
        const enrollments = await Bill.find({ userId: data }).populate('listOfCourse');
        return enrollments
    } catch (error) {
        return { error: error }
    }
}