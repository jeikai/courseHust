const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const quizModel = require('./Quiz');
const QuestionSchema = new Schema({
	question: { type: String, required: true },
	level: {
		type: String,
		enum: [
			'perception',
			'comprehension',
			'application',
			'advanced application',
		],
		required: true,
		default: 'perception',
	},
	options: [{ type: String, default: '' }],
	answer: { type: String, default: '' },
	// mark: { type: Number, default: 0 },
	date_created: Date,
	date_updated: Date,
});

const Question = mongoose.model('Question', QuestionSchema, 'questions');
exports.schema = Question;

exports.create = async function (quizzId, data) {
	try {
		const questionData = {
			question: data.question,
			level: data.level,
			options: data.options,
			answer: data.answer,
			// mark: data.mark,
			date_created: new Date(),
			date_updated: new Date(),
		};
		const newQuestion = Question(questionData);
		await newQuestion.save();
		await quizModel.addQuiz(quizzId, newQuestion._id);
		return { data: newQuestion };
	} catch (error) {
		return { error: error };
	}
};
exports.findById = async function (questionId) {
	try {
		const question = await Question.findById(questionId);
		return question;
	} catch (error) {
		return { error };
	}
};

/**
 * Represents a newly updated question.
 * @typedef {Object} questionData
 * @property {string} question - The updated question.
 * @property {number} level - The updated level of the question.
 * @property {Array<string>} options - The updated options for the question.
 * @property {string} answer - The updated answer for the question.
 * @property {Date} date_updated - The date when the question was updated.
 */

/**
 * Updates a question in the database and returns the updated question.
 * @param {string} questionId - The ID of the question to update.
 * @param {Object} data - The updated data for the question.
 * @returns {Promise<Question>} The updated question.
 */

exports.update = async (questionId, questionData) => {
	try {
		const newQuestion = await Question.findByIdAndUpdate(
			questionId,
			{
				question: questionData.question,
				level: questionData.level,
				options: questionData.options,
				answer: questionData.answer,
				date_updated: new Date(),
			},
			{ new: true }
		);
		return newQuestion;
	} catch (error) {
		return { error };
	}
};

/**
 * @param {string} questionId - the ID of question to delete
 * @returns  {Promise<Question>} - The deleted question
 */

exports.delete = async (questionId) => {
	try {
		const deletedQuestion = await Question.findByIdAndDelete(questionId);
		return deletedQuestion;
	} catch (error) {
		return { error };
	}
};
