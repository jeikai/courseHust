const courseModel = require('../models/Course')
const utility = require('../helper/utility')
const sectionModel = require('../models/Section')
const lessonModel = require('../models/Lesson')

exports.create = async function (req, res) {
    try {
        const data = req.body
        console.log(data)
        utility.validate(data, ['instructorId', 'title', 'description',
            'categoryId', 'level', 'price'])

        const newCourse = await courseModel.create(data)
        if (newCourse.hasOwnProperty('error')) return res.status(500).json({ message: newCourse.error })

        if (data.sections) {
            for (const section of data.sections) {
                console.log(section)
                try {
                    utility.validate(section, ['title'])
                    const newSection = await sectionModel.create({ ...section, courseId: newCourse._id })
                    if (newSection.hasOwnProperty('error')) {
                        console.log("Lỗi khi tạo section")
                        console.log(newSection.error)
                        return res.status(500).json({ message: newSection.error })
                    }

                    if (section.specials) {
                        for (const spec of section.specials) {
                            try {
                                spec.sectionId = newSection._id
                                const checkSpec = section.specialIds.find(item => item.id === spec.id)
                                if (checkSpec.type === "lesson") {
                                    utility.validate(spec, ['sectionId', 'title', 'content', 'videoURL', 'duration'])
                                    const newLesson = await lessonModel.create(spec)
                                    if (newLesson.hasOwnProperty('error')) {
                                        console.log("Lỗi tạo lesson")
                                        console.log(newLesson.error)
                                        return res.status(500).json({ message: newLesson.error })
                                    }
                                }
                                //if checkSpec.type === "quiz"
                            } catch (error) {
                                console.log("lỗi gì gì đó trong này")
                                console.log(error)
                                return res.status(500).json({ message: error.message })
                            }
                        }
                    }
                } catch (error) {
                    console.log("inside for")
                    console.log(error)
                    return res.status(500).json({ message: error.message })
                }
            }
        }
        const query = { courseId: newCourse._id }
        const response = await courseModel.get(query)
        return res.status(200).json({ message: "Course created successfully", data: response })
    } catch (e) {
        console.log(e)
        return res.status(500).json({ message: e.message })
    }
}


exports.getById = async function (req, res) {
    try {
        const courseId = req.params.courseId
        const data = { courseId: courseId }
        const result = await courseModel.get(data)

        if (!result || result.error) return res.status(500).json({ message: "fail to find" })

        if (result.hasOwnProperty('error')) return res.status(500).json({ message: result.error })

        return res.status(200).json(result)
    } catch (e) {
        return res.status(500).json({ message: e.message })
    }
}

exports.getByCategory = async function (req, res) {
    try {
        let query = {}
        query.categoryId = req.body.categoryId || ''
        query.categoryTitle = req.body.categoryTitle || ''

        const courses = await courseModel.get(query)
        if (courses.hasOwnProperty('error')) return res.status(500).json({ message: courses.error })
        if (courses.hasOwnProperty('error')) return res.status(500).json({ message: courses.error })

        return res.status(200).json(courses)

    } catch (e) {
        return res.status(500).json({ message: e.message })
    }
}

exports.getAll = async function (req, res) {
    try {
        const courses = await courseModel.get()
        if (courses.hasOwnProperty('error')) return res.status(500).json({ message: courses.error })

        return res.status(200).json(courses)
    } catch (e) {
        return res.status(500).json({ message: e.message })
    }
}

exports.getByTitle = async function (req, res) {
    try {
        const data = req.body
        utility.validate(data, ['title'])

        const courses = await courseModel.get(data)
        if (courses.hasOwnProperty('error')) return res.status(500).json({ message: courses.error })

        return res.status(200).json(courses)
    } catch (e) {
        return res.status(500).json({ message: e.message })
    }
}

exports.getByInstructorId = async function (req, res) {
    try {
        const data = req.params.instructorId
        // utility.validate(data, ['instructorId'])
        const query = {
            instructorId: data
        }
        const courses = await courseModel.get(query)
        if (courses.hasOwnProperty('error')) return res.status(500).json({ message: courses.error })

        return res.status(200).json(courses)
    } catch (e) {
        return res.status(500).json({ message: e.message })
    }
}


exports.update = async function (req, res) {
    try {
        const courseId = req.params.courseId
        const data = req.body
        const result = await courseModel.update(courseId, data)
        if (result.error) return res.status(500).json({ message: "Failed to update", data: result.error })
        return res.status(200).json(result)
    } catch (e) {
        return res.status(500).json({ message: e.message })
    }
}
