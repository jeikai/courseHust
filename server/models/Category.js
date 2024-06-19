const mongoose = require('mongoose')
const Schema = mongoose.Schema

const categorySchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    subCategory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'SubCategory' }]
})

const Category = mongoose.model('Category', categorySchema, 'categories')
exports.schema = Category

exports.create = async function (data) {
    try {
        const categoryData = {
            title: data.title,
            description: data.description
        }
        const newCategory = Category(categoryData)
        await newCategory.save()
        return newCategory
    } catch (e) {
        return { error: e }
    }
}

exports.get = async function (data) {
    try {
        if (!data) return await Category.find({})

        let query = {}
        if (data.categoryId) query._id = data.categoryId
        if (data.title) query.title = data.title
        return await Category.find(query).populate("subCategory")
    } catch (e) {
        console.log(e)
        return { error: e }
    }
}

exports.addSubCategory = async function (categoryId, subCategoryId) {
    try {
		const category = await Category.findById(categoryId);
		if (!category) return { error: 'category not found' };

		category.subCategory.push(subCategoryId);
		category.markModified('subCategory');
		await category.save();
	} catch (err) { 
		return { error: err };
	}
}

exports.update = async function (categoryId, data) {
    try {
        const result = await Category.findByIdAndUpdate(categoryId, data)
        return await Category.findById(result._id)
    } catch (err) {
        return { error: err }
    }
}

exports.delete = async function (categoryId) {
    try {
        const result = await Category.findByIdAndDelete(categoryId)
        return result
    } catch (e) {
        return { error: e }
    }
}