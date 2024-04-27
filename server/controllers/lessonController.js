const lessonModel = require('../models/Lesson')
const utility = require('../helper/utility')

exports.create = async function(req, res){
    try{
        const data = req.body
        utility.validate(data, ['sectionId', 'title', 'content', 'videoURL', 'duration'])

        const newLesson = await lessonModel.create(data)
        if(newLesson.hasOwnProperty('error')) return res.status(500).json({message: newLesson.error})

        return res.status(200).json({message: "Section created successfully", data: newLesson})
        
    }catch(e){
        return res.status(500).json({message: e.message})
    }
} 

exports.getById = async function(req, res) {
    try {
        const lessonId = req.params.lessonId;

        const lesson = await lessonModel.getById(lessonId);
        return res.status(200).json(lesson)
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}