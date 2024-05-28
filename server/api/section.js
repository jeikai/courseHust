const api = require('express').Router();
const sectionController = require('../controllers/sectionController');
const authMiddleware = require('../middlewares/authMiddleware');
const use = require('../helper/utility').use;

api.post('/section/:courseId', use(sectionController.create));

api.get('/section', use(sectionController.getById));
api.get(
	'/section/:sectionId/random-questions',
	use(sectionController.getRandomQuestions)
);
api.delete('/section/quiz/:quizId', use(sectionController.deleteQuiz));
module.exports = api;
