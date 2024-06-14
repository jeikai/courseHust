const sectionModel = require('../models/Section');
const utility = require('../helper/utility');

exports.create = async function (req, res) {
	try {
		const courseId = req.params.courseId;
		let data = req.body;
		utility.validate(data, ['title']);

		data = { ...data, courseId: courseId };
		const newSection = await sectionModel.create(data);
		if (newSection.hasOwnProperty('error'))
			return res.status(500).json({ message: newSection.error });

		return res
			.status(200)
			.json({ message: 'Section created successfully', data: newSection });
	} catch (e) {
		return res.status(500).json({ message: e.message });
	}
};
exports.get =async (req, res) => {
	try {
		const {sectionId} = req.params;
		const section = await sectionModel.getById(sectionId);
		return res.status(200).json(section)
	} catch (error) {
		return res.status(500).json({message: error.message})
	}
}
exports.getById = async function (req, res) {
	try {
		const data = await req.body;
		utility.validate(data, ['sectionId', 'specType']);
		console.log('get by id', data);

		const section = await sectionModel.get(data);
		if (!section) return res.status(500).json({ message: section.error });
		if (section.hasOwnProperty('error'))
			return res.status(500).json({ message: section.error });

		return res.status(200).json(section);
	} catch (e) {
		return res.status(500).json({ message: e.message });
	}
};
exports.getRandomQuestions = async function (req, res) {
	try { 
		const { courseId } = req.params;
		const randomQuestions = await sectionModel.getAllQuestionsByCategory(
			courseId
		);
		console.log(randomQuestions);
		return res.status(200).json({ randomQuestions });
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
};
exports.deleteQuiz = async (req, res) => {
	try {
		const { quizId } = req.params;
		const result = await sectionModel.deleteQuiz(quizId);
		return res.status(200).json({ data: result });
	} catch (error) {
		return res.status(500).json({
			message: error.message,
		});
	}
};
exports.update = async (req, res) => {
	try {
		const { sectionId } = req.params;
		const data = await req.body;
		const result = await sectionModel.update(sectionId, data);
		return res.status(200).json({
			data: result,
		});
	} catch (error) {
		return res.status(500).json({
			message: error.message,
		});
	}
};
exports.delete = async (req, res) => {
	try {
		const { sectionId } = await req.params;
		const { courseId } = await req.query;
		console.log(sectionId, courseId);
		const result = await sectionModel.delete(sectionId, courseId);
		return res.status(200).json({
			data: 'test',
		});
	} catch (error) {
		return res.status(500).json({
			message: error.message,
		});
	}
};
