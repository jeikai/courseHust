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

exports.get = async function(categoryTitle){
    try{
        const result = await Category.findOne({ title: categoryTitle}).lean()
        return result
    }catch(e){
        return {error: e}
    }
}