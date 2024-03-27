const mongoose = require('mongoose')
const Schema = mongoose.Schema
const sectionModel = require('./Section')

const LessonSchema = new Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    videoURL: { type: String, required: true },
    docURL: { type: String },
    duration: { type: Number, required: true },
    date_created: Date,
    date_updated: Date
})

const Lesson = mongoose.model('Lesson', LessonSchema, 'lessons')
exports.schema = Lesson

exports.create = async function(data){
    try{
        const lessonData = {
            title: data.title,
            content: data.content,
            videoURL: data.videoURL,
            docURL: data.docURL || '',
            duration: parseFloat(data.duration),
            date_created: new Date(),
            date_updated: new Date()
        }
        const newLesson = Lesson(lessonData)
        await newLesson.save()
        await sectionModel.addSpec(data.sectionId, newLesson._id, "lesson")
        return newLesson
    }catch(err){
        return {error: err}
    }
}