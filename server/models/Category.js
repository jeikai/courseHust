const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Question = require('./Question')
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

exports.getWithNumberOfQuestion = async function (data) {
    try {
        const categories = await Category.find({}).populate("subCategory");

        // Helper function to count questions by level from a list of questions
        const countQuestionsByLevel = (questions) => {
            const levels = ['perception', 'comprehensive', 'application', 'advanced application'];
            const levelCounts = levels.reduce((acc, level) => {
                acc[level] = 0;
                return acc;
            }, {});

            questions.forEach(question => {
                if (levelCounts.hasOwnProperty(question.level)) {
                    levelCounts[question.level]++;
                }
            });

            return levelCounts;
        };

        // Process each category
        for (let category of categories) {
            const categoryQuestions = await Question.getQuestionByCategory(category._id);
            const categoryLevelCounts = countQuestionsByLevel(categoryQuestions.data);
            Object.assign(category._doc, categoryLevelCounts); // Add level counts to the category

            // Process each subcategory
            for (let subcategory of category.subCategory) {
                const subcategoryQuestions = await Question.getQuestionBySubCategory(subcategory._id);
                const subcategoryLevelCounts = countQuestionsByLevel(subcategoryQuestions.data);
                Object.assign(subcategory._doc, subcategoryLevelCounts); // Add level counts to the subcategory
            }
        }

        return categories;
    } catch (e) {
        console.log(e);
        return { error: e };
    }
};


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