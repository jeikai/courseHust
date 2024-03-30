const quizModel = require('../models/Quiz')

exports.getById = async function(req, res){
    try{
        const {quizId} = req.params

        const result = await quizModel.getById(quizId)

        return res.status(200).json({data: result})
        
    }catch(e){
        return res.status(500).json({message: e.message})
    }
}