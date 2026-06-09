const mongoose = require('mongoose')
const Schema = mongoose.Schema
const categoryModel = require('./Category')
const subcategorySchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true }
})

const SubCategory = mongoose.model('SubCategory', subcategorySchema, 'subcategories')
exports.schema = SubCategory

exports.create = async function (data, categoryId) {
    try {
        const categoryData = {
            title: data.title,
            description: data.description
        }
        const newCategory = SubCategory(categoryData)
        await newCategory.save()
        await categoryModel.addSubCategory(categoryId, newCategory._id)
        return newCategory
    } catch (e) {
        console.log(e)
        return { error: e }
    }
}

exports.get = async function (data) {
    try {
        if (!data) return await SubCategory.find({})

        let query = {}
        if (data.categoryId) query._id = data.categoryId
        if (data.title) query.title = data.title
        return await SubCategory.find(query).lean()
    } catch (e) {
        return { error: e }
    }
}

exports.update = async function (categoryId, data) {
    try {
        const result = await SubCategory.findByIdAndUpdate(categoryId, data)
        return await SubCategory.findById(result._id)
    } catch (err) {
        return { error: err }
    }
}

exports.delete = async function (categoryId) {
    try {
        const result = await SubCategory.findByIdAndDelete(categoryId)
        return result
    } catch (e) {
        return { error: e }
    }
}