const courseModel = require('../models/Course')
const utility = require('../helper/utility')
const sectionModel = require('../models/Section')
const lessonModel = require('../models/Lesson')

// Models return { error: <raw Mongoose error> } on failure instead of throwing.
// Never forward that raw error object to the client - it leaks schema paths and
// internal detail. Extract a readable message and a sane status code instead.
function sendModelError(res, err) {
    const isValidation = err && err.name === 'ValidationError'
    return res.status(isValidation ? 400 : 500).json({ message: err?.message || 'Failed to save data' })
}

exports.create = async function (req, res) {
    try {
        const data = req.body
        console.log(data)
        utility.validate(data, ['instructorId', 'title',
            'categoryId', 'level'])

        const newCourse = await courseModel.create(data)
        if (newCourse.hasOwnProperty('error')) return sendModelError(res, newCourse.error)

        if (data.sections) {
            for (const section of data.sections) {
                console.log(section)
                try {
                    utility.validate(section, ['title'])
                    const newSection = await sectionModel.create({ ...section, courseId: newCourse._id })
                    if (newSection.hasOwnProperty('error')) {
                        console.log("Lỗi khi tạo section")
                        console.log(newSection.error)
                        return sendModelError(res, newSection.error)
                    }

                    if (section.specials) {
                        for (const spec of section.specials) {
                            try {
                                spec.sectionId = newSection._id
                                const checkSpec = section.specialIds.find(item => item.id === spec.id)
                                if (checkSpec.type === "lesson") {
                                    // utility.validate(spec, ['sectionId', 'title', 'videoURL', 'duration'])
                                    const newLesson = await lessonModel.create(spec)
                                    if (newLesson.hasOwnProperty('error')) {
                                        console.log("Lỗi tạo lesson")
                                        console.log(newLesson.error)
                                        return sendModelError(res, newLesson.error)
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
        return res.status(e.status || 500).json({ message: e.message })
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


// Fields a client is allowed to set via update - never mass-assign the whole
// request body, since it may carry stray keys (e.g. a mistyped field name)
// that should be ignored rather than silently persisted.
const UPDATABLE_COURSE_FIELDS = [
    'title', 'shortDes', 'description', 'isStream', 'categoryId', 'level',
    'courseVideo', 'tags', 'price', 'thumbnail', 'sections',
]

exports.update = async function (req, res) {
    try {
        const courseId = req.params.courseId
        const data = req.body

        const existing = await courseModel.getRaw(courseId)
        if (!existing) return res.status(404).json({ message: 'Course not found' })

        if (data.userRole !== 'admin' && existing.instructorId?.toString() !== data.instructorId?.toString()) {
            return res.status(403).json({ message: 'You are not allowed to update this course' })
        }

        const updateData = {}
        UPDATABLE_COURSE_FIELDS.forEach((field) => {
            if (data[field] !== undefined) updateData[field] = data[field]
        })
        updateData.date_updated = new Date()

        const result = await courseModel.update(courseId, updateData)
        if (result.error) return sendModelError(res, result.error)

        return res.status(200).json({ message: 'Course updated successfully', data: result })
    } catch (e) {
        return res.status(500).json({ message: e.message })
    }
}

exports.delete = async function (req, res) {
    try {
        const courseId = req.params.courseId
        const data = req.body

        const existing = await courseModel.getRaw(courseId)
        if (!existing) return res.status(404).json({ message: 'Course not found' })

        if (data.userRole !== 'admin' && existing.instructorId?.toString() !== data.instructorId?.toString()) {
            return res.status(403).json({ message: 'You are not allowed to delete this course' })
        }

        const result = await courseModel.deleteCourse(courseId)
        if (result.error) return sendModelError(res, result.error)
        return res.status(200).json(result)
    } catch (e) {
        return res.status(500).json({ message: e.message })
    }
}

