const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const courseModel = require('./Course');
const quizModel = require('./Quiz');
const lessonModal = require('./Lesson');
const questionModel = require('./Question')
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

exports.getAllQuestionsByCategory = async function (courseId) {
	try {
		const course = await courseModel.get({courseId: courseId});
		if (!course) return { error: 'Course not found' };

		const categoryId = course.categoryId;
		const questionsResult = await questionModel.getQuestionByCategory(categoryId)
		if (!questionsResult?.data) return { error: 'No questions found for this category' };
		
		let randomQuestions;

		if (questionsResult?.data.length > 10) {
			randomQuestions = questionsResult?.data.sort(() => 0.5 - Math.random()).slice(0, 10);
		} else {
			randomQuestions = questionsResult?.data;
		}
 
		return randomQuestions;
	} catch (error) {
		console.log(error)
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
exports.update = async (sectionId, data) => {
	try {
		const result = await Section.findByIdAndUpdate(sectionId, data, {
			new: true,
		});
		return result;
	} catch (error) {
		return { error };
	}
};
exports.delete = async (sectionId, courseId) => {
	try {
		const section = await Section.findById(sectionId);
		const specs = section.specs;
		const sectionId = section._id;
		await Promise.all(
			specs.forEach(async (spec) => {
				if (spec.type == 'lesson') {
					const deletedLesson = await lessonModal.delete(spec._id);
				} else if (spec.type == 'quiz') {
					const deletedQuiz = await quizModel.deleteQuiz(spec._id);
				}
			})
		);
		//delete sectionId form course
		const course = await courseModel.deleteSectionId(courseId, sectionId);
		const deleteSection = await Section.findByIdAndDelete(sectionId);
		return deleteSection;
	} catch (error) {
		return { error };
	}
};
