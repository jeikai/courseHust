const api = require('express').Router();
const questionController = require('../controllers/questionController');
const authMiddleware = require('../middlewares/authMiddleware');
const use = require('../helper/utility').use;

api.post('/question/autoquiz/getQues', use(questionController.getAutoQuiz));
api.post('/question/:quizId', use(questionController.create));
api.post('/question', use(questionController.singleCreate));
api.delete('/question/:questionId', use(questionController.delete));
api.put('/question/:questionId', use(questionController.update));
api.get(
	'/question/category/:categoryId',
	use(questionController.getQuestionByCategory)
);

module.exports = api;
