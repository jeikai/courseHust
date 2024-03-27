const mongoose = require('mongoose')
const Schema = mongoose.Schema
const courseModel = require('./Course')

const SectionSchema = new Schema({
    title: { type: String, required: true },
    spec: [
            {
                id: {type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }, 
                type: { type: String, enum: ['lesson', 'quiz'], default: 'lesson'}
            }, 
            { 
                id: {type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' },
                type: { type: String, enum: ['lesson', 'quiz'], default: 'quiz'}
            }
            ],
    date_created: Date,
    date_updated: Date
})

const Section = mongoose.model('Section', SectionSchema, 'sections')
exports.schema = Section

exports.create = async function(data){
    try{
        const course = await courseModel.get({courseId: data.courseId})
        const sections = course.sections
        const checkSection = sections.some(item => item.title === data.title)
        if(checkSection) {
            return {error: "section existed in course"}
        }
        const sectionData = {
            title: data.title,
            date_created: new Date(),
            date_updated: new Date()
        }

        const newSection = Section(sectionData)
        await newSection.save()
        await courseModel.addSection(data.courseId, newSection._id)
        return newSection
    }catch(err){
        return {error: err}
    }
}


