const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const sectionModel = require('./Section');
const courseModel = require('./Course');
const questionModel = require('./Question');

const QuizSchema = new Schema({
	title: { type: String, required: true },
	duration: { type: String, default: '' },
	ques: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Question',
		},
	],
	startTime: { type: Date, default: '' },
	endTime: { type: Date, default: '' },
	totalMarks: { type: Number, default: 10 },
	passMarks: { type: Number, default: 10 },
	isReview: { type: Boolean, default: true },
	date_created: Date,
	date_updated: Date,
});

const Quiz = mongoose.model('Quiz', QuizSchema, 'quizs');
exports.schema = Quiz;

exports.create = async function (sectionId, data) {
	try {
		const quizData = {
			title: data.title,
			duration: data.duration,
			ques: data.ques,
			startTime: data.startTime || '',
			endTime: data.endTime || '',
			totalMarks: data.totalMarks,
			passMarks: data.passMarks,
			isReview: data.isReview,
			date_created: new Date(),
			date_updated: new Date(),
		};
		const newQuiz = Quiz(quizData);
		await newQuiz.save();
		await sectionModel.addSpec(sectionId, newQuiz._id, 'quiz');
		return newQuiz;
	} catch (error) {
		console.log(error);
		return { error: error };
	}
};

exports.getById = async function (data) {
	try {
		const quiz = await Quiz.findById(data).populate('ques');
		return quiz;
	} catch (error) {
		return { error: error };
	}
};

exports.getByInstructorId = async function (data) {
	try {
		const query = {
			instructorId: data,
		};
		const resultCourse = await courseModel.get(query);
		const allSpecs = resultCourse
			.map((course) => course.sections)
			.flat()
			.map((section) => section.specs);

		console.log(allSpecs)
		const quizSpecs = allSpecs.flat().filter((spec) => spec.type === 'quiz');
		console.log(quizSpecs.length);
		return quizSpecs;
	} catch (error) {
		console.log(error)
		return { error: error };
	}
};

exports.addQuiz = async function (quizId, questionId) {
	try {
		const quiz = await Quiz.findById(quizId);
		if (!quiz) return { error: 'quiz not found' };

		quiz.ques.push(questionId);
		quiz.date_updated = new Date();
		quiz.markModified('ques');
		quiz.markModified('date_updated');
		await quiz.save();
	} catch (error) {
		return { error: error };
	}
};

exports.getAllQuestions = async function (quizId) {
	try {
		const quiz = await Quiz.findById(quizId);
		let quesIds = quiz.ques;
		let questions = [];

		await Promise.all(
			quesIds.map(async function (quesId) {
				const id = quesId.toString();
				const q = await questionModel.findById(id);
				questions.push(q);
			})
		);

		return questions;
	} catch (error) {
		return { error };
	}
};

exports.updateQuiz = async (quizId, data) => {
	console.log('quiz data', data);
	const result = await Quiz.findByIdAndUpdate(
		quizId,
		{
			title: data.title,
			duration: data.duration,
			ques: data.ques,
			startTime: data.startTime || '',
			endTime: data.endTime || '',
			totalMarks: data.totalMarks,
			passMarks: data.passMarks,
			date_updated: new Date(),
		},
		{ new: true }
	);
	return result;
};
exports.deleteQuiz = async function (quizId) {
	try {
		const quiz = await Quiz.findByIdAndDelete(quizId);
		return quiz;
	} catch (error) {
		return { error };
	}
};
