import authHttp from '../authHttp';

/**
 * AI知识问答相关API
 */

// AI智能问答
export const aiChat = (data) => {
  return authHttp.post('/api/ai/chat/', data);
};

// 获取对话历史
export const getChatHistory = (params = {}) => {
  return authHttp.get('/api/ai/history/', { params });
};

// 获取使用情况统计
export const getUsageStats = () => {
  return authHttp.get('/api/ai/usage/');
};

// 清空对话历史
export const clearChatHistory = () => {
  return authHttp.delete('/api/ai/history/clear/');
};
