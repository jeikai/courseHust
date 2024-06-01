const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const sectionModel = require('./Section');

const LessonSchema = new Schema({
	title: { type: String, required: true },
	content: { type: String, default: '' },
	videoURL: { type: String, default: '' },
	docURL: { type: String, default: '' },
	duration: { type: Number, required: true },
	date_created: Date,
	date_updated: Date,
});

const Lesson = mongoose.model('Lesson', LessonSchema, 'lessons');
exports.schema = Lesson;

exports.create = async function (data) {
	try {
		const lessonData = {
			title: data.title,
			content: data.content || '',
			videoURL: data.videoURL,
			docURL: data.docURL || '',
			duration: parseFloat(data.duration),
			date_created: new Date(),
			date_updated: new Date(),
		};
		console.log('create lesson', lessonData);
		const newLesson = Lesson(lessonData);
		await newLesson.save();
		await sectionModel.addSpec(data.sectionId, newLesson._id, 'lesson');
		return newLesson;
	} catch (err) {
		console.log(err);
		return { error: err };
	}
};

exports.getById = async function (id) {
	try {
		if (!mongoose.Types.ObjectId.isValid(id)) {
			throw new Error('Invalid lesson ID');
		}

		const lesson = await Lesson.findById(id);
		if (!lesson) {
			return null;
		}

		return lesson;
	} catch (err) {
		console.error(err);
		throw err;
	}
};
exports.update = async (lessonId, data) => {
	try {
		const updatedLesson = Lesson.findByIdAndUpdate(lessonId, data, {
			new: true,
		});
		return updatedLesson;
	} catch (error) {
		return { error };
	}
};
exports.delete = async (lessonId) => {
	try {
		const deletedLesson = Lesson.findByIdAndDelete(lessonId);
		return deletedLesson;
	} catch (error) {
		return { error };
	}
};
