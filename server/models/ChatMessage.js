const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chatMessageSchema = new Schema({
	conversationId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'ChatConversation',
		required: true,
	},
	userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
	role: { type: String, enum: ['user', 'assistant'], required: true },
	content: { type: String, required: true },
	recommendedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
	createdAt: { type: Date, default: Date.now },
});

const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema, 'chat_messages');
exports.schema = ChatMessage;

exports.create = async function (data) {
	try {
		const msg = new ChatMessage(data);
		await msg.save();
		return msg;
	} catch (error) {
		return { error: error.message };
	}
};

exports.getByConversationId = async function (conversationId) {
	try {
		return await ChatMessage.find({ conversationId })
			.populate({
				path: 'recommendedCourses',
				select: 'title shortDes thumbnail level price rating categoryId',
				populate: { path: 'categoryId', select: 'title' },
			})
			.sort({ createdAt: 1 })
			.lean();
	} catch (error) {
		return { error: error.message };
	}
};

exports.deleteByConversationId = async function (conversationId) {
	try {
		return await ChatMessage.deleteMany({ conversationId });
	} catch (error) {
		return { error: error.message };
	}
};
