import authHttp from '../authHttp';

/**
 * 代码提交与评测相关API
 */

// 提交代码
export const submitCode = (data) => {
  return authHttp.post('/api/submissions/submit/', data);
};

// 获取提交列表
export const getSubmissionList = (params = {}) => {
  return authHttp.get('/api/submissions/', { params });
};

// 获取提交详情
export const getSubmissionDetail = (submissionId) => {
  return authHttp.get(`/api/submissions/${submissionId}/`);
};
