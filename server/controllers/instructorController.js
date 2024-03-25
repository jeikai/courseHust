const Generator = require('../generator/question_generator/generator');

exports.postQuestions = async (req, res) => {
    try {
        //get the file from the request
        const file = req.file;

        const filePath = file.path;

        const questions= await Generator.pass(filePath);
        //TODO: store this questions in the database
        return res.status(200).json(questions);
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
}