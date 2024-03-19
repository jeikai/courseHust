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