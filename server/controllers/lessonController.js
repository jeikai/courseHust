const lessonModel = require('../models/Lesson');
const utility = require('../helper/utility');
const { message } = require('antd');

exports.create = async function (req, res) {
	try {
		const data = await req.body;
		console.log('lesson data', data);
		//! BUG
		// utility.validate(data, [
		// 	'title',
		// 	'content',
		// 	'videoURL',
		// 	'duration',
		// 	'sectionId',
		// ]);

		const newLesson = await lessonModel.create(data);
		console.log('new lesson', newLesson);
		if (newLesson.hasOwnProperty('error'))
			return res.status(500).json({ message: newLesson.error });

		return res
			.status(200)
			.json({ message: 'Section created successfully', data: newLesson });
	} catch (e) {
		return res.status(500).json({ message: e.message });
	}
};

exports.getById = async function (req, res) {
	try {
		const lessonId = req.params.lessonId;

		const lesson = await lessonModel.getById(lessonId);
		return res.status(200).json(lesson);
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
};
exports.update = async (req, res) => {
	try {
		const { lessonId } = req.params;
		const data = await req.body;
		const result = await lessonModel.update(lessonId, data);
		console.log(result)
		return res.status(200).json({ data: result });
	} catch (error) {
		console.log(error)
		return res.status(500).json({
			message: error.message, 
		});
	}
};
exports.delete = async (req, res) => {
	try {
		const { lessonId } = req.params;
		const result = await lessonModel.delete(lessonId);
		return res.status(200).json({ data: result });
	} catch (error) {
		return res.status(500).json({
			message: error.message,
		});
	}
};
