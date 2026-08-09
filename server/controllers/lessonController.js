const lessonModel = require('../models/Lesson');
const utility = require('../helper/utility');
const Section = require('../models/Section').schema;
const Course = require('../models/Course').schema;
const Process = require('../models/Process').schema;
const User = require('../models/User').schema;

// Lessons aren't linked to a course directly - find the Section that lists
// this lesson in its specs, then the Course that lists that Section.
async function findCourseIdForLesson(lessonId) {
	const section = await Section.findOne({ 'specs._id': lessonId });
	if (!section) return null;
	const course = await Course.findOne({ sections: section._id });
	return course ? course._id : null;
}

async function canAccessLesson(userId, courseId) {
	const user = await User.findById(userId);
	if (user && (user.role === 'admin' || user.role === 'teacher')) return true;
	const owns = await Process.findOne({ userId, courseId });
	return Boolean(owns);
}

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
		const userId = req.body.userId;

		const courseId = await findCourseIdForLesson(lessonId);
		if (!courseId) {
			return res.status(404).json({ message: 'Lesson not found' });
		}
		if (!(await canAccessLesson(userId, courseId))) {
			return res.status(403).json({ message: 'You do not have access to this lesson' });
		}

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
