const { message } = require('antd');
const questionModel = require('../models/Question');

exports.create = async function (req, res) {
	try {
		const quizId = req.params.quizId;

		const data = req.body;
		data.forEach((question) => {
			const result = questionModel.create(quizId, question);
		});
		return res.status(200).json({ response: true });
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
};
exports.update = async function (req, res) {
	try {
		const { questionId, questionData } = req.params;
		const result = await questionModel.update(questionId, data);
		return res.status(200).json({
			data: result,
		});
	} catch (error) {
		return res.status(500).json({
			message: error.message,
		});
	}
};
