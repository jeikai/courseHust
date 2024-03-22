const mongoose = require('mongoose')
const Schema = mongoose.Schema
const categoryModel = require('./Category')

const courseSchema = new Schema({
    instuctorId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    title: { type: String, required: true, unique: true},
    description: { type: String, required: true },
    categoryId: {type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
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
    } catch (error) {
        return { error: error }
    }
}
 
exports.get = async function(query){
    try{
        if(!query)
            return await Course.find({})
        if(query.hasOwnProperty('courseId')){
            return await Course.findById(query.courseId)
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
        }

    }catch(err){
        return {error: err}
    }
}
