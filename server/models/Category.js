const mongoose = require('mongoose')
const Schema = mongoose.Schema

const categorySchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true }
})

const Category = mongoose.model('Category', categorySchema, 'categories')
exports.schema = Category

exports.create = async function(data){
    try{
        const categoryData = {
            title: data.title,
            description: data.description
        }
        const newCategory = Category(categoryData)
        await newCategory.save()
        return newCategory
    }catch(e){
        return {error: e}
    }
}

exports.get = async function(data){
    try{
        if(!data) return await Category.find({})
        
        let query = {}
        if(data.categoryId) query._id = data.categoryId
        if(data.categoryTitle) query.title = data.categoryTitle
        return await Category.findOne(query).lean()
    }catch(e){
        return {error: e}
    }
}