const courseModel = require('../models/Course')

exports.createCourse = async function(req, res){
    try {
        const data = req.body
        const newCourse = await courseModel.create(data)
        return res.status(200).json({
            message: 'Create course successfully',
            data: newCourse,
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({message: error.message})
    }
}

exports.getDetail = async function(req, res){
    try {
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({message: error.message})
    }
}