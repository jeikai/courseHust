const sectionModel = require('../models/Section')
const utility = require('../helper/utility')

exports.create = async function(req, res){
    try{
        const courseId = req.params.courseId
        let data = req.body
        utility.validate(data, ['title'])

        data = {...data, courseId: courseId}
        const newSection = await sectionModel.create(data)
        if(newSection.hasOwnProperty('error')) return res.status(500).json({message: newSection.error})

        return res.status(200).json({message: "Section created successfully", data: newSection})
    }catch(e){
        return res.status(500).json({message: e.message})
    }
}

exports.getById = async function(req, res){
    try{
        const data = req.body
        utility.validate(data, ['sectionId', 'specType'])

        const section = await sectionModel.get(data)
        if(!section)  return res.status(500).json({message: 'bad request'})
        if(section.hasOwnProperty('error')) return res.status(500).json({message: section.error})

        return res.status(200).json(section)

    }catch(e){
        return res.status(500).json({message: e.message})
    }
}