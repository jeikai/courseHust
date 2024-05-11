const mongoose = require('mongoose')
const Schema = mongoose.Schema
const courseModel = require('./Course')

const SectionSchema = new Schema({
    title: { type: String, required: true },
    lesson: [
        {
            _id: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' },

        }
    ],
    quiz: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'Quiz'
    }],
    date_created: Date,
    date_updated: Date
})

const Section = mongoose.model('Section', SectionSchema, 'sections')
exports.schema = Section

exports.create = async function (data) {
    try {
        const course = await courseModel.get({ courseId: data.courseId })
        const sections = course.sections
        const checkSection = sections.some(item => item.title === data.title)
        if (checkSection) {
            return { error: "section existed in course" }
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
    } catch (err) {
        return { error: err }
    }
}

exports.addLesson = async function (sectionId, id, type) {
    try {
        const section = await Section.findById(sectionId)
        if (!section) return { error: 'section not found' }

        section.lesson.push(id)
        section.date_updated = new Date()
        section.markModified("lesson")
        section.markModified("date_updated")
        await section.save()
    } catch (err) {
        return { error: err }
    }
}

exports.addQuiz = async function (sectionId, id, type) {
    try {
        const section = await Section.findById(sectionId)
        if (!section) return { error: 'section not found' }

        section.quiz.push(id)
        section.date_updated = new Date()
        section.markModified("quiz")
        section.markModified("date_updated")
        await section.save()
    } catch (err) {
        return { error: err }
    }
}

exports.get = async function (data) {
    try {
        const section = await Section.findById(data.sectionId).populate('lesson').populate('quiz')
        return section
    } catch (err) {
        return { error: err }
    }
}


