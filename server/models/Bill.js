const mongoose = require('mongoose')
const Enrollment = require('../models/Enrollment')
const Process = require('../models/Process')
const Schema = mongoose.Schema
// bảng này dành cho hoá đơn
const BillSchema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    methodPayment: { type: String },
    listOfCourse: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
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
        courseIds.forEach((courseId) => {
            const dataForProcess = {
                userId: data.userId,
                courseId: courseId
            }
            Process.create(dataForProcess)
        })
        const billData = {
            userId: data.userId,
            methodPayment: data.methodPayment,
            listOfCourse: courseIds,
            price: totalPrice,
            date_created: new Date(),
            date_updated: new Date()
        }
        const newBill = Bill(billData)
        await newBill.save()
        return newBill
    } catch (error) {
        console.log(error)
        return { error: error }
    }
}

exports.getTotalAmountByUserId = async function (data) {
    try {
        const enrollments = await Enrollment.getById(data.userId);
        if (!enrollments.length) {
            return { error: "Không tìm thấy khóa học nào cho người dùng này." };
        }

        const totalPrice = enrollments.reduce((acc, enrollment) => {
            const coursePrice = enrollment.courseId.price;
            return acc + coursePrice;
        }, 0);
        
        return totalPrice + 10000;
    } catch (error) {
        console.log(error)
        return { error: error }
    }
}

exports.get = async function () {
    try {
        const result = await Bill.find().populate('listOfCourse')
        return result;
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

exports.getByUserIdAndCourseId = async function (userId, courseId) {
    try {

        const bill = await Bill.find({ userId: userId })
        let isFound = false;
        bill.forEach((bill) => {
            bill.listOfCourse.forEach((course) => {
                if (course == courseId) {
                    isFound = true;
                    return;
                }
            })
        })
        return isFound;
    } catch (error) {
        console.log(error)
        return { error: error.message };
    }
};

exports.getByCourseId = async function (courseId) {
    try {
        const bills = await Bill.find({ 'listOfCourse': courseId }).populate('listOfCourse');
        return bills;
    } catch (error) {
        console.error("Error fetching bills by courseId:", error);
        return { error: error.message };
    }
};

exports.getCourseStatistics = async function () {
    try {
        const result = await Bill.aggregate([
            {
                $unwind: '$listOfCourse'
            },
            {
                $group: {
                    _id: {
                        courseId: '$listOfCourse',
                        year: { $year: '$date_created' },
                        month: { $month: '$date_created' },
                        quarter: { $ceil: { $divide: [{ $month: '$date_created' }, 3] } }
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: 'courses',
                    localField: '_id.courseId',
                    foreignField: '_id',
                    as: 'courseDetails'
                }
            },
            {
                $group: {
                    _id: {
                        year: '$_id.year',
                        month: '$_id.month',
                        quarter: '$_id.quarter'
                    },
                    courses: {
                        $push: {
                            courseId: '$_id.courseId',
                            count: '$count',
                            details: { $arrayElemAt: ['$courseDetails', 0] }
                        }
                    }
                }
            },
            {
                $sort: {
                    '_id.year': 1,
                    '_id.month': 1
                }
            }
        ]);

        return result;
    } catch (error) {
        console.error("Error fetching course statistics:", error);
        return { error: error.message };
    }
};