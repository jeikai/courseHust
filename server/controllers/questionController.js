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
		console.log(error);
		return res.status(500).json({ message: error.message });
	}
};
exports.singleCreate = async (req, res) => {
	try {
		const { questionData } = await req.body;
		console.log(questionData);
		const result = await questionModel.singleCreate(questionData);

		return res.status(200).json({ data: result.data });
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: error.message });
	}
};
exports.update = async function (req, res) {
	try {
		const { questionId } = req.params;
		const { questionData } = await req.body;

		const result = await questionModel.update(questionId, questionData);
		return res.status(200).json({
			data: result.data,
		});
	} catch (error) {
		return res.status(500).json({
			message: error.message,
		});
	}
};
exports.delete = async (req, res) => {
	try {
		const { questionId } = req.params;
		const result = await questionModel.delete(questionId);
		return res.status(200).json({
			data: result,
		});
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};
exports.getQuestionByCategory = async (req, res) => {
	try {
		const { categoryId } = req.params;
		const result = await questionModel.getQuestionByCategory(categoryId);
		return res.status(200).json({
			data: result.data,
		});
	} catch (error) {
		return res.status(200).json({ error: error.message });
	}
};

exports.getAutoQuiz = async (req, res) => {
	try {
		const data = req.body;
		const result = await questionModel.getAutoQuiz(data);
		return res.status(200).json({
			data: result?.data,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({ error: error.message });
	}
};
exports.getById = async (req, res) => {
	try {
		const questionId = req.params.questionId;
		const responseGetQuestion = await questionModel.getById(questionId);
		return res.status(200).json({
			data: responseGetQuestion,
		});
	} catch (error) {
		return res.status(500).json({
			error: error.message,
		});
	}
};
exports.getAllQuestions = async (req, res) => {
	try {
		const userId = req.params.userId;
		const responseGetQuestions = await questionModel.getAllQuestions(userId);
		return res.status(200).json({
			data: responseGetQuestions,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({ error: error.message });
	}
};
