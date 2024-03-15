const mongoose = require('mongoose')
const Schema = mongoose.Schema

const courseSchema = new Schema({
    instuctorId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    title: { type: String, required: true, unique: true},
    description: { type: String, required: true },
    categoryId: {type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    level: { type: String, enum: ['basic', 'intermediate', 'advanced', 'specialized'], default: 'basic'},
    language: { type: String, required: true },
    tags: [{ type: String, required: true }],
    price: { type: Number, required: true },
    thumbnail: { type: String, required: true },
    date_created: Date,
    date_updated: Date
})

const Course = mongoose.model('Course', courseSchema, 'courses')
exports.schema = Course

exports.create = async function(data){
    try{
        const checkCourse = await Course.findOne({instuctorId: data.instuctorId, title: data.title})
        if(checkCourse) return {error: 'Course existed'}
        const courseData = {
            instuctorId: data.instuctorId,
            title: data.title, 
            description: data.description, 
            categoryId: data.categoryId,
            level: data.level || "basic",
            language: data.language,
            tags: data.tags || [],
            price: parseFloat(data.price),
            thumbnail: data.thumbnail || '',
            date_created: new Date(),
            date_updated: new Date()
        }
        const newCourse = Course(courseData)
        await newCourse.save()
        return newCourse
    }catch(err){
        return {error: err}
    }
}

exports.get = async function(data){
    
}