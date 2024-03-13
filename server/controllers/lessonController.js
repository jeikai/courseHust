const lessonModel = require('../models/Lesson')
const clourdinary = require('cloudinary').v2;

clourdinary.config({
    
})
exports.createLesson = async function(req, res){
    try {
        const data = req.body
        return res.status(200).json({data})
    } catch (error) {
        console.log(error)
        return res.status(500).json({message: error.message})
    }
}