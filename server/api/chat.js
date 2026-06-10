const api = require('express').Router();
const controller = require('../controllers/chatController');
const authMiddleware = require('../middlewares/authMiddleware');
const use = require('../helper/utility').use;

api.post('/chat/message', authMiddleware.protectAny, use(controller.sendMessage));
api.get('/chat/conversations', authMiddleware.protectAny, use(controller.getConversations));
api.get('/chat/conversations/:id', authMiddleware.protectAny, use(controller.getConversationById));
api.delete('/chat/conversations/:id', authMiddleware.protectAny, use(controller.deleteConversation));

module.exports = api;
