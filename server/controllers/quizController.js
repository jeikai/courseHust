const { message } = require('antd');
const quizModel = require('../models/Quiz');
const sectionModel = require('../models/Section');
exports.getById = async function (req, res) {
	try {
		const { quizId } = req.params;

		const result = await quizModel.getById(quizId);

		return res.status(200).json({ data: result });
	} catch (e) {
		return res.status(500).json({ message: e.message });
	}
};

exports.getByInstructorId = async function (req, res) {
	try {
		const { instructorId } = req.params;

		const result = await quizModel.getByInstructorId(instructorId);

		return res.status(200).json({ data: result });
	} catch (e) {
		return res.status(500).json({ message: e.message });
	}
};

exports.create = async function (req, res) {
	try { 
		const data = req.body;
		const sectionId = req.params.sectionId;
		const result = await quizModel.create(sectionId, data);
		return res.status(200).json({ data: result });
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
};
exports.update = async function (req, res) {
	try {
		const { quizId } = req.params;
		const quizData = await req.body;

		const result = await quizModel.updateQuiz(quizId, quizData.quizData);
		return res.status(200).json({ data: result });
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
};
exports.delete = async (req, res) => {
	try {
		const { quizId } = req.params;
		const deleteFromSection = await sectionModel.updateMany(
			{}, // Update all sections
			{ $pull: { specs: { _id: quizId, type: 'quiz' } } } // Pull matching elements
		);
		const result = await quizModel.deleteQuiz(quizId);

		return res.status(200).json({ data: result });
	} catch (error) {
		return res.status(500).json({
			message: error.message,
		});
	}
};
