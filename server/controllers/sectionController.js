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