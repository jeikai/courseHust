const mongoose = require('mongoose')
const Schema = mongoose.Schema
const categoryModel = require('./Category')

const courseSchema = new Schema({
    instructorId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    title: { type: String, required: true, unique: true},
    description: { type: String, required: true },
    categoryId: {type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    level: { type: String, enum: ['basic', 'intermediate', 'advanced', 'specialized'], default: 'basic'},
    language: { type: String, required: true },
    tags: [{ type: String, required: true }],
    price: { type: Number, required: true },
    thumbnail: { type: String, required: true },
    sections: [{type: mongoose.Schema.Types.ObjectId, ref: 'Section'}],
    date_created: Date,
    date_updated: Date
})

const Course = mongoose.model('Course', courseSchema, 'courses')
exports.schema = Course

exports.create = async function(data){
    try{
        const checkCourse = await Course.findOne({instructorId: data.instructorId, title: data.title})
        if(checkCourse) return {error: 'Course existed'}
        const courseData = {
            instructorId: data.instructorId,
            title: data.title, 
            description: data.description, 
            categoryId: data.categoryId,
            level: data.level || "basic",
            language: data.language,
            tags: data.tags || [],
            price: parseFloat(data.price),
            thumbnail: data.thumbnail || '',
            sections: data.sections || [],
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

exports.get = async function(query){
    try{
        if(!query)
            return await Course.find({})
        if(query.hasOwnProperty('courseId')){
            return await Course.findById(query.courseId).populate('sections')
        }else if(query.hasOwnProperty('categoryTitle') || query.hasOwnProperty('categoryId')){
            const category = await categoryModel.get(query)
            if(category){
                const courses = await Course.find({categoryId: category._id})
                return courses
            }
            return {error: 'not found'}
        }else if(query.hasOwnProperty('title')){
            // const regex = new RegExp(query.title, 'i')
            return await Course.find({title: { $regex: query.title, $options: 'i' } })
        }else if(query.hasOwnProperty('instructorId')){
            return await Course.find({instructorId: query.instructorId})
        }

    }catch(err){
        return {error: err}
    }
}

exports.addSection = async function(courseId, sectionId){
    try{
        const course = await Course.findById(courseId)
        if(!course) return {error: "course not found"}

        course.sections.push(sectionId)
        course.markModified("sections")
        await course.save()
    }catch(err){
        return {error: err}
    }
}