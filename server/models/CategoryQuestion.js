const mongoose = require('mongoose')
const Schema = mongoose.Schema

const categoryQuestionSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true }
})

const CategoryQuestion = mongoose.model('CategoryQuestion', categoryQuestionSchema, 'categoryQuestions')
exports.schema = CategoryQuestion

exports.create = async function(data){
    try{
        const categoryData = {
            title: data.title,
            description: data.description
        } 
        const newCategory = CategoryQuestion(categoryData)
        await newCategory.save()
        return newCategory
    }catch(e){
        return {error: e}
    }
}

exports.get = async function(data){
    try{
        if(!data) return await CategoryQuestion.find({})
        
        let query = {}
        if(data.categoryId) query._id = data.categoryId
        if(data.title) query.title = data.title
        return await Category.find(query).lean()
    }catch(e){
        return {error: e}
    }
}

exports.update = async function(categoryId, data){
    try{
        const result = await CategoryQuestion.findByIdAndUpdate(categoryId, data)
        return await Category.findById(result._id)
    }catch(err){
        return {error: err}
    }
}

exports.delete = async function(categoryId){
    try{
        const result = await CategoryQuestion.findByIdAndDelete(categoryId)
        return result
    }catch(e){
        return {error: e}
    }
}