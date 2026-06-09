const categoryModel = require('../models/Category');
const utility = require('../helper/utility');

exports.create = async function (req, res) {
	try {
		const data = req.body;
		utility.validate(data, ['title', 'description']);

		const checkCategory = await categoryModel.get(data);
		console.log(checkCategory);
		if (checkCategory.length > 0) {
			return res.status(400).json({ message: 'Category existed!' });
		}

		const newcategory = await categoryModel.create(data);
		if (newcategory.hasOwnProperty('error'))
			return res.status(500).json({ message: newcategory.error });

		return res
			.status(200)
			.json({ message: 'Create Category Successfully', data: newcategory });
	} catch (e) {
		return res.status(500).json({ message: e.message });
	}
};

exports.get = async function (req, res) {
	try {
		let query = {};
		query.categoryId = req.body.categoryId || '';
		query.title = req.body.title || '';

		const result = await categoryModel.get(query);
		if (result.hasOwnProperty('error'))
			return res.status(500).json({ message: result.error });

		return res.status(200).json(result);
	} catch (e) {
		return res.status(500).json({ message: e.message });
	}
};

exports.getWithNumberOfQuestion = async function (req, res) {
	try {
		const result = await categoryModel.getWithNumberOfQuestion();
		if (result.hasOwnProperty('error'))
			return res.status(500).json({ message: result.error });

		return res.status(200).json(result);
	} catch (e) {
		return res.status(500).json({ message: e.message });
	}
};

exports.update = async function (req, res) {
	try {
		const categoryId = req.params.categoryId;
		const data = req.body;
		const result = await categoryModel.update(categoryId, data);
		if (result.error)
			return res
				.status(500)
				.json({ message: 'Failed to update', data: result.error });
		return res.status(200).json(result);
	} catch (e) {
		return res.status(500).json({ message: e.message });
	}
};

exports.delete = async function (req, res) {
	try {
		const categoryId = req.params.categoryId;
		const result = await categoryModel.delete(categoryId);
		if (!result) return res.status(400).json({ message: 'Failed to delete' });
		return res.status(200).json(result);
	} catch (e) {
		return res.status(500).json({ message: e.message });
	}
};

