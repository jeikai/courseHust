const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chatConversationSchema = new Schema({
	userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
	title: { type: String, default: 'New Conversation' },
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
});

const ChatConversation = mongoose.model('ChatConversation', chatConversationSchema, 'chat_conversations');
exports.schema = ChatConversation;

exports.create = async function (userId) {
	try {
		const conv = new ChatConversation({ userId, title: 'New Conversation' });
		await conv.save();
		return conv;
	} catch (error) {
		return { error: error.message };
	}
};

exports.getByUserId = async function (userId) {
	try {
		return await ChatConversation.find({ userId })
			.sort({ updatedAt: -1 })
			.lean();
	} catch (error) {
		return { error: error.message };
	}
};

exports.getById = async function (id, userId) {
	try {
		return await ChatConversation.findOne({ _id: id, userId }).lean();
	} catch (error) {
		return { error: error.message };
	}
};

exports.updateTitle = async function (id, title) {
	try {
		return await ChatConversation.findByIdAndUpdate(
			id,
			{ title, updatedAt: new Date() },
			{ new: true }
		);
	} catch (error) {
		return { error: error.message };
	}
};

exports.updateTimestamp = async function (id) {
	try {
		return await ChatConversation.findByIdAndUpdate(id, { updatedAt: new Date() });
	} catch (error) {
		return { error: error.message };
	}
};

exports.delete = async function (id, userId) {
	try {
		return await ChatConversation.findOneAndDelete({ _id: id, userId });
	} catch (error) {
		return { error: error.message };
	}
};
