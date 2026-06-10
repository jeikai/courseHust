const { GoogleGenerativeAI } = require('@google/generative-ai');
const courseModel = require('../models/Course');
const chatConversationModel = require('../models/ChatConversation');
const chatMessageModel = require('../models/ChatMessage');

let geminiModel = null;

function getGeminiModel() {
	if (!geminiModel && process.env.GOOGLE_AI_API_KEY) {
		try {
			const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
			geminiModel = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
		} catch (e) {
			console.error('Failed to init Gemini:', e.message);
		}
	}
	return geminiModel;
}

function stripHtml(html) {
	if (!html) return '';
	return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim().substring(0, 200);
}

// Rule-based NLP fallback: score courses against the user query
function scoreCoursesFallback(courses, query) {
	const queryLower = query.toLowerCase();
	const words = queryLower.split(/\s+/).filter((w) => w.length > 2);

	const keywordBoosts = {
		python: ['python'],
		javascript: ['javascript', 'js', 'node', 'nodejs', 'react', 'vue', 'angular'],
		backend: ['backend', 'server', 'api', 'node', 'express', 'django', 'spring'],
		frontend: ['frontend', 'html', 'css', 'react', 'vue', 'ui', 'ux'],
		data: ['data', 'analytics', 'science', 'ml', 'machine learning', 'ai', 'pandas'],
		mobile: ['mobile', 'android', 'ios', 'flutter', 'react native'],
		devops: ['devops', 'docker', 'kubernetes', 'ci', 'cd', 'cloud', 'aws'],
		database: ['database', 'sql', 'mongodb', 'mysql', 'postgresql', 'redis'],
		security: ['security', 'cyber', 'hacking', 'penetration', 'encryption'],
		design: ['design', 'ui', 'ux', 'figma', 'photoshop', 'graphic'],
	};

	const scored = courses.map((course) => {
		let score = 0;
		const titleLower = (course.title || '').toLowerCase();
		const descLower = stripHtml(course.shortDes || course.description || '').toLowerCase();
		const tags = (course.tags || []).map((t) => t.toLowerCase());
		const categoryTitle = (course.categoryId?.title || '').toLowerCase();

		words.forEach((word) => {
			if (titleLower.includes(word)) score += 5;
			if (descLower.includes(word)) score += 3;
			if (tags.some((t) => t.includes(word))) score += 2;
			if (categoryTitle.includes(word)) score += 3;
		});

		// Keyword group boosts
		Object.values(keywordBoosts).forEach((group) => {
			const queryHasGroup = group.some((kw) => queryLower.includes(kw));
			const courseHasGroup = group.some(
				(kw) => titleLower.includes(kw) || descLower.includes(kw) || tags.some((t) => t.includes(kw))
			);
			if (queryHasGroup && courseHasGroup) score += 3;
		});

		return { course, score };
	});

	return scored
		.filter((item) => item.score > 0)
		.sort((a, b) => b.score - a.score)
		.slice(0, 5)
		.map((item) => item.course);
}

async function callGemini(userMessage, courses) {
	const model = getGeminiModel();
	if (!model) throw new Error('Gemini not available');

	const courseList = courses.slice(0, 50).map((c) => ({
		id: c._id.toString(),
		title: c.title,
		shortDes: stripHtml(c.shortDes) || stripHtml(c.description),
		level: c.level,
		category: c.categoryId?.title || '',
		tags: c.tags || [],
	}));

	const prompt = `You are a helpful educational advisor for an online learning platform called FunCourse.

User message: "${userMessage}"

Available courses (JSON):
${JSON.stringify(courseList)}

Respond ONLY with valid JSON in exactly this format:
{
  "reply": "A friendly 2-3 sentence response explaining your recommendations",
  "recommendedCourseIds": ["courseId1", "courseId2"]
}

Rules:
- Only use course IDs from the list above
- Recommend at most 5 courses
- If no courses match well, set recommendedCourseIds to [] and suggest browsing
- Never invent courses not in the list
- Keep the reply concise and encouraging`;

	const result = await model.generateContent(prompt);
	const text = result.response.text();

	// Strip markdown code fences if present
	const cleaned = text.replace(/```json\n?/gi, '').replace(/```\n?/g, '').trim();

	let parsed;
	try {
		parsed = JSON.parse(cleaned);
	} catch (_) {
		const match = cleaned.match(/\{[\s\S]*\}/);
		if (!match) throw new Error('No valid JSON in Gemini response');
		parsed = JSON.parse(match[0]);
	}

	if (!parsed.reply || !Array.isArray(parsed.recommendedCourseIds)) {
		throw new Error('Gemini response missing required fields');
	}

	return parsed;
}

// POST /api/chat/message
exports.sendMessage = async function (req, res) {
	try {
		const { message, conversationId } = req.body;
		const userId = req.body.userId;

		if (!message || !message.trim()) {
			return res.status(400).json({ message: 'Message is required' });
		}

		// Get or create conversation
		let conversation;
		if (conversationId) {
			conversation = await chatConversationModel.getById(conversationId, userId);
			if (!conversation) {
				return res.status(404).json({ message: 'Conversation not found' });
			}
		} else {
			conversation = await chatConversationModel.create(userId);
			if (conversation.error) {
				return res.status(500).json({ message: conversation.error });
			}
		}

		// Load all courses
		const allCourses = (await courseModel.get()) || [];

		// Save user message
		await chatMessageModel.create({
			conversationId: conversation._id,
			userId,
			role: 'user',
			content: message.trim(),
			recommendedCourses: [],
		});

		let reply = '';
		let recommendedCourseIds = [];
		let geminiUsed = false;

		// Try Gemini first
		try {
			const geminiResult = await callGemini(message.trim(), allCourses);
			reply = geminiResult.reply;
			recommendedCourseIds = geminiResult.recommendedCourseIds || [];
			geminiUsed = true;
		} catch (geminiError) {
			console.warn('Gemini unavailable, using fallback:', geminiError.message);

			const matched = scoreCoursesFallback(allCourses, message.trim());
			recommendedCourseIds = matched.map((c) => c._id.toString());

			if (matched.length > 0) {
				reply = `Based on your interest, here are some courses that could help you on your learning journey:`;
			} else {
				// Generic fallback: return top courses
				const fallbackCourses = allCourses.slice(0, 5);
				recommendedCourseIds = fallbackCourses.map((c) => c._id.toString());
				reply = `I couldn't find an exact match, but here are some of our popular courses you might enjoy:`;
			}
		}

		// Validate IDs against real courses
		const allCourseIdSet = new Set(allCourses.map((c) => c._id.toString()));
		const validIds = recommendedCourseIds.filter((id) => allCourseIdSet.has(id));

		// Save assistant message
		await chatMessageModel.create({
			conversationId: conversation._id,
			userId,
			role: 'assistant',
			content: reply,
			recommendedCourses: validIds,
		});

		// Update conversation metadata
		await chatConversationModel.updateTimestamp(conversation._id);
		if (conversation.title === 'New Conversation') {
			const title = message.trim().length > 50 ? message.trim().substring(0, 50) + '…' : message.trim();
			await chatConversationModel.updateTitle(conversation._id, title);
		}

		// Build recommended courses response
		const recommendedCourses = allCourses
			.filter((c) => validIds.includes(c._id.toString()))
			.map((c) => ({
				_id: c._id,
				title: c.title,
				shortDes: c.shortDes,
				thumbnail: c.thumbnail,
				level: c.level,
				categoryId: c.categoryId,
				price: c.price,
				rating: c.rating,
			}));

		return res.status(200).json({
			conversationId: conversation._id,
			reply,
			recommendedCourses,
			geminiUsed,
		});
	} catch (error) {
		console.error('sendMessage error:', error);
		return res.status(500).json({ message: error.message });
	}
};

// GET /api/chat/conversations
exports.getConversations = async function (req, res) {
	try {
		const userId = req.body.userId;
		const conversations = await chatConversationModel.getByUserId(userId);
		if (conversations && conversations.error) {
			return res.status(500).json({ message: conversations.error });
		}
		return res.status(200).json(conversations || []);
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
};

// GET /api/chat/conversations/:id
exports.getConversationById = async function (req, res) {
	try {
		const userId = req.body.userId;
		const { id } = req.params;

		const conversation = await chatConversationModel.getById(id, userId);
		if (!conversation) {
			return res.status(404).json({ message: 'Conversation not found' });
		}

		const messages = await chatMessageModel.getByConversationId(id);

		return res.status(200).json({
			conversation,
			messages: messages.error ? [] : messages,
		});
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
};

// DELETE /api/chat/conversations/:id
exports.deleteConversation = async function (req, res) {
	try {
		const userId = req.body.userId;
		const { id } = req.params;

		const conversation = await chatConversationModel.getById(id, userId);
		if (!conversation) {
			return res.status(404).json({ message: 'Conversation not found' });
		}

		await chatMessageModel.deleteByConversationId(id);
		await chatConversationModel.delete(id, userId);

		return res.status(200).json({ message: 'Conversation deleted successfully' });
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
};
