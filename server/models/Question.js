const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const quizModel = require('./Quiz');
const QuestionSchema = new Schema({
	userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
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
	answer: [{ type: String, default: '' }],
	categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
	subcategoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'SubCategory' },
	type: { type: String, enum: ['single', 'multiple', 'text'] }, // single là trắc nghiệm 1 đáp án, multiple là trắc nghiệm nhiều đáp án. Text là tự luận
	date_created: Date,
	date_updated: Date,
});

const Question = mongoose.model('Question', QuestionSchema, 'questions');
exports.schema = Question;
exports.singleCreate = async (data) => {
    try {
        // Validate and process subcategoryId
        let subcategoryId = data.subcategoryId;
        if (!subcategoryId || subcategoryId.trim() === '') {
            subcategoryId = null; // or handle as needed
        }

        const questionData = {
            userId: data.userId,
            question: data.question,
            level: data.level,
            options: data.options,
            answer: data.answer,
            categoryId: data.categoryId,
            subcategoryId: subcategoryId,
            type: data.type,
            date_created: new Date(),
            date_updated: new Date(),
        };

        const newQuestion = Question(questionData);
        await newQuestion.save();
        return { data: newQuestion };
    } catch (error) {
        console.log(error);
        return { error: error };
    }
};

exports.create = async function (quizzId, data) {
	try {
		let subcategoryId = data.subcategoryId;
        if (!subcategoryId || subcategoryId.trim() === '') {
            subcategoryId = null; // or handle as needed
        }
		const questionData = {
			userId: data.userId,
			question: data.question,
			level: data.level,
			options: data.options,
			answer: data.answer,
			categoryId: data.categoryId,
			subcategoryId: subcategoryId,
			type: data.type,
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
exports.delete = async (questionId) => {
	try {
		const result = await Question.findByIdAndDelete(questionId);
		return { data: result };
	} catch (error) {
		return { error };
	}
};
exports.update = async (questionId, questionData) => {
	try {
		const updateData = {
			question: questionData.question,
			options: questionData.options,
			answer: questionData.answer,
			date_updated: new Date(),
		};
		if (questionData.type) {
			updateData.type = questionData.type;
		}
		if (questionData.categoryId) {
			updateData.categoryId = questionData.categoryId;
		}
		if (questionData.level) {
			updateData.level = questionData.level;
		}
		const result = await Question.findByIdAndUpdate(questionId, updateData, {
			new: true,
		});
		return { data: result };
	} catch (error) {
		return { error };
	}
};
exports.findById = async (questionId) => {
	try {
		const result = await Question.findById(questionId);
		return { data: result };
	} catch (error) {
		return { error };
	}
};
exports.getQuestionByCategory = async (categoryId) => {
	try {
		const result = await Question.find({ categoryId: categoryId });
		return { data: result };
	} catch (error) {
		return { error };
	}
};
