const courseModel = require('../models/Course')
const utility = require('../helper/utility')

exports.create = async function(req, res){
    try{
        const data = req.body
        utility.validate(data, ['instuctorId', 'title', 'description', 
        'categoryId', 'level', 'language', 'price'])

        const newCourse = await courseModel.create(data)
        if(newCourse.hasOwnProperty('error')) return res.status(500).json({message: newCourse.error})

        return res.status(200).json({message: "Course created successfully", data: newCourse})
    }catch(e){
        return res.status(500).json({message: e.message})
    }
}

exports.getById = async function(req, res){
    try{
        const courseId = req.params.courseId
        const data = {courseId: courseId}
        const result = await courseModel.get(data)
        if(result.hasOwnProperty('error')) return res.status(500).json({message: result.error})

        return res.status(200).json(result)
    }catch(e){
        return res.status(500).json({message: e.message})
    }
}

exports.getByCategory = async function(req, res){
    try{
        let query = {}
        query.categoryId = req.body.categoryId || ''
        query.categoryTitle = req.body.categoryTitle || ''

        const courses = await courseModel.get(query)
        console.log(courses);
        if(courses.hasOwnProperty('error')) return res.status(500).json({message: courses.error})

        return res.status(200).json(courses)

    }catch(e){
        return res.status(500).json({message: e.message})
    }
}

exports.getAll = async function(req, res){
    try{
        const courses = await courseModel.get()
        if(courses.hasOwnProperty('error')) return res.status(500).json({message: courses.error})

        return res.status(200).json(courses)
    }catch(e){
        return res.status(500).json({message: e.message})
    }
}

exports.getByTitle = async function(req, res){
    try{
        const data = req.body
        utility.validate(data, ['title'])

        const courses = await courseModel.get(data)
        if(courses.hasOwnProperty('error')) return res.status(500).json({message: courses.error})
        
        return res.status(200).json(courses)
    }catch(e){
        return res.status(500).json({message: e.message})
    }
}

exports.getByInstructorId = async function(req, res){
    try{
        const data = req.body
        utility.validate(data, ['instructorId'])

        const courses = await courseModel.get(data)
        if(courses.hasOwnProperty('error')) return res.status(500).json({message: courses.error})
        
        return res.status(200).json(courses)
    }catch(e){
        return res.status(500).json({message: e.message})
    }
}