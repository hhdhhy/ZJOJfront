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

// 获取知识库列表
export const getKnowledgeList = (params = {}) => {
  return authHttp.get('/api/ai/knowledge/', { params });
};

// 创建知识库文档
export const createKnowledge = (data) => {
  return authHttp.post('/api/ai/knowledge/', data);
};

// 更新知识库文档
export const updateKnowledge = (id, data) => {
  return authHttp.put(`/api/ai/knowledge/${id}/`, data);
};

// 删除知识库文档
export const deleteKnowledge = (id) => {
  return authHttp.delete(`/api/ai/knowledge/${id}/`);
};

// 获取学生个性化学情报告
export const getStudentReport = (params = {}) => {
  return authHttp.get('/api/ai/report/student/', { params });
};

// 获取班级共性学情报告
export const getClassReport = (classId, params = {}) => {
  return authHttp.get(`/api/ai/report/class/${classId}/`, { params });
};

// 获取错误解决方案
export const getErrorSolution = (submissionId) => {
  return authHttp.get(`/api/ai/error-solution/${submissionId}/`);
};
