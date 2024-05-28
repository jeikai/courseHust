const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const courseModel = require('./Course');
const quizModel = require('./Quiz');
const SectionSchema = new Schema({
	title: { type: String, required: true },
	specs: [
		{
			_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' },
			type: { type: String, enum: ['lesson', 'quiz'], default: 'lesson' },
		},
		{
			_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' },
			type: { type: String, enum: ['lesson', 'quiz'], default: 'quiz' },
		},
	],
	date_created: Date,
	date_updated: Date,
});

const Section = mongoose.model('Section', SectionSchema, 'sections');
exports.schema = Section;

exports.create = async function (data) {
	try {
		const course = await courseModel.get({ courseId: data.courseId });
		const sections = course.sections;
		const checkSection = sections.some((item) => item.title === data.title);
		if (checkSection) {
			return { error: 'section existed in course' };
		}
		const sectionData = {
			title: data.title,
			date_created: new Date(),
			date_updated: new Date(),
		};

		const newSection = Section(sectionData);
		await newSection.save();
		await courseModel.addSection(data.courseId, newSection._id);
		return newSection;
	} catch (err) {
		return { error: err };
	}
};

exports.addSpec = async function (sectionId, id, type) {
	try {
		const section = await Section.findById(sectionId);
		if (!section) return { error: 'section not found' };

		section.specs.push({ _id: id, type: type });
		section.date_updated = new Date();
		section.markModified('specs');
		section.markModified('date_updated');
		await section.save();
	} catch (err) {
		return { error: err };
	}
};

exports.get = async function (data) {
	try {
		const section = await Section.findById(data.sectionId)
			.populate('specs._id')
			.where('specs.type')
			.equals(data.specType);
		return section;
	} catch (err) {
		return { error: err };
	}
};

exports.getAllQuestionsBySection = async function (sectionId) {
	try {
		const section = await Section.findById(sectionId);
		const quizzesId = [];
		section.specs.forEach((spec) => {
			if (spec.type === 'quiz') quizzesId.push(spec._id.toString());
		});
		const questions = [];
		await Promise.all(
			quizzesId.map(async (quiz) => {
				const ques = await quizModel.getAllQuestions(quiz);
				questions.push(...ques);
			})
		);

		if (questions.length < 10) return questions;
		const randQuestions = [];
		for (let i = 0; i < 10; i++)
			randQuestions.push(
				questions[Math.floor(Math.random() * questions.length)]
			);
		return randQuestions;
	} catch (error) {
		return { error };
	}
};
exports.deleteQuiz = async (quizId) => {
	try {
		const delQuiz = await quizModel.deleteQuiz(quizId);
		const result = await Section.updateMany(
			{},
			{
				$pull: {
					specs: {
						_id: quizId,
					},
				},
			}
		);
		return result;
	} catch (error) {
		return { error };
	}
};
