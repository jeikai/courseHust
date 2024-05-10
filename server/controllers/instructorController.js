const Generator = require('../generator/question_generator/generator');
const questionModel = require('../models/Question')
const quizModel = require('../models/Quiz')
exports.postQuestions = async (req, res) => {
    try {
        const file = req.file;

        const filePath = file.path;
        const questions = await Generator.pass(filePath);

        const modifiedQuestions = questions
            .map(question => {
                return {
                    ...question,
                    level: 'perception',
                    answer: '',
                };
            });
        const savedQuestions = await Promise.all(modifiedQuestions.map(async question => {
            return questionModel.create(question);
        }));
        const savedQuesIds = savedQuestions.map(question => question.data._id);
        const newQuiz = {
            title: req.body.title,
            ques: savedQuesIds
        }
        const result = await quizModel.create(newQuiz);
        return res.status(200).json(result);
    } catch (e) {
        console.log(e)
        return res.status(500).json({ message: e.message });
    }
} 