const api = require('express').Router();
const sectionController = require('../controllers/sectionController');
const authMiddleware = require('../middlewares/authMiddleware');
const use = require('../helper/utility').use;

api.post('/section/:courseId', use(sectionController.create));
api.get('/section/:sectionId', use(sectionController.get))
api.post('/section', use(sectionController.getById));
api.get(
	'/section/:courseId/random-questions',
	use(sectionController.getRandomQuestions)
);
api.delete('/section/quiz/:quizId', use(sectionController.deleteQuiz));
api.delete('/section/:sectionId', use(sectionController.delete))
api.put('/section/:sectionId', use(sectionController.update));
module.exports = api;
