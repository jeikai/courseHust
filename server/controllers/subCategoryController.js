const subcategoryModel = require('../models/SubCategory');
const utility = require('../helper/utility');

exports.create = async function (req, res) {
	try {
		const data = req.body;
        const categoryId = req.params.categoryId;
        console.log(data, categoryId)
		utility.validate(data, ['title', 'description']);

		const checkCategory = await subcategoryModel.get(data);
		console.log(checkCategory);
		if (checkCategory.length > 0) {
			return res.status(400).json({ message: 'Subcategory existed!' });
		}

		const newcategory = await subcategoryModel.create(data, categoryId);
		if (newcategory.hasOwnProperty('error'))
			return res.status(500).json({ message: newcategory.error });

		return res
			.status(200)
			.json({ message: 'Create Category Successfully', data: newcategory });
	} catch (e) {
        console.log(e)
		return res.status(500).json({ message: e.message });
	}
};

exports.update = async function (req, res) {
	try {
		const subcategoryId = req.params.subcategoryId;
		const data = req.body;
		const result = await subcategoryModel.update(subcategoryId, data);
		if (result.error)
			return res
				.status(500)
				.json({ message: 'Failed to update', data: result.error });
		return res.status(200).json(result);
	} catch (e) {
		return res.status(500).json({ message: e.message });
	}
}