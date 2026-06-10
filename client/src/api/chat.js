import Axios from 'axios';

export const sendMessage = async (message, conversationId) => {
  const { data } = await Axios.post('/api/chat/message', { message, conversationId });
  return data;
};

export const getConversations = async () => {
  const { data } = await Axios.get('/api/chat/conversations');
  return data;
};

export const getConversationById = async (id) => {
  const { data } = await Axios.get(`/api/chat/conversations/${id}`);
  return data;
};

export const deleteConversation = async (id) => {
  const { data } = await Axios.delete(`/api/chat/conversations/${id}`);
  return data;
};
