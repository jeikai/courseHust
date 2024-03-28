const Generator = require('../generator/question_generator/generator');
const questionModel = require('../models/Question')
exports.postQuestions = async (req, res) => {
    try {
        const file = req.file;

        const filePath = file.path;

        const questions = await Generator.pass(filePath);
        const listOfQues = questions.filter(question => !question.hasProperty('error'))
        .map(question => questionModel(question));

        return res.status(200).json(questions);
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
} 