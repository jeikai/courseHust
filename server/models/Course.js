const mongoose = require('mongoose')
const Schema = mongoose.Schema

const courseSchema = new Schema({
    instuctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    level: { type: String, enum: ['basic', 'intermediate', 'advanced', 'specialized'], default: 'basic' },
    language: { type: String, required: true },
    tags: [{ type: String, required: true }],
    price: { type: Number, required: true },
    thumbnail: { type: String, required: true }, 
    date_created: Date,
    date_updated: Date
})

const Course = mongoose.model('Course', courseSchema, 'courses')
exports.schema = Course

exports.create = async function (data) {
    try {
        const courseData = {
            instuctorId: data.instuctorId,
            title: data.title,
            description: data.description,
            category: data.category,
            level: data.level,
            language: data.language,
            tags: data.tags,
            price: data.price,
            thumbnail: data.thumbnail,
            date_created: new Date(),
            date_updated: new Date()
        }
        const newCourse = Course(courseData)
        await newCourse.save()
        return newCourse
    } catch (error) {
        return { error: error }
    }
}

exports.get = async function (data) {
    try {
        let query = {}
        if (data.id) query._id = data.id
        const course = await Course.findOne(query)
        return course
    } catch (e) {
        return { error: e }
    }
}

exports.update = async function (courseId, data) {
    try {
        const result = await Course.findByIdAndUpdate(courseId, data)
        return await Course.findById(result._id)
    } catch (e) {
        return { error: e }
    }
}

exports.delete = async function (courseId) {
    try {
        const result = await Course.findByIdAndDelete(courseId)
        return result
    } catch (e) {
        return { error: e }
    }
}

exports.getAll = async function () {
    try {
        const course = await Course.find({});
        return course;
    } catch (e) {
        return { error: e };
    }
};