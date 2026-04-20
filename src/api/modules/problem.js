import authHttp from '../authHttp';

/**
 * 题目管理相关API
 */

// 获取题目列表
export const getProblemList = (params = {}) => {
  return authHttp.get('/api/problems/', { params });
};

// 获取题目详情
export const getProblemDetail = (problemId) => {
  return authHttp.get(`/api/problems/${problemId}/`);
};

// 创建题目
export const createProblem = (data) => {
  return authHttp.post('/api/problems/create/', data);
};

// 更新题目(PUT - 完整更新)
export const updateProblem = (problemId, data) => {
  return authHttp.put(`/api/problems/${problemId}/`, data);
};

// 更新题目(PATCH - 部分更新)
export const patchProblem = (problemId, data) => {
  return authHttp.patch(`/api/problems/${problemId}/`, data);
};

// 删除题目
export const deleteProblem = (problemId) => {
  return authHttp.delete(`/api/problems/${problemId}/`);
};

// 获取标签列表
export const getTagList = () => {
  return authHttp.get('/api/problems/tags/');
};

// 创建标签
export const createTag = (data) => {
  return authHttp.post('/api/problems/tags/create/', data);
};

// 上传测试用例
export const uploadTestcases = (problemId, formData) => {
  return authHttp.post(`/api/problems/${problemId}/testcases/upload/`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

// 获取测试用例列表
export const getTestcaseList = (problemId) => {
  return authHttp.get(`/api/problems/${problemId}/testcases/`);
};

// 删除测试用例
export const deleteTestcases = (problemId) => {
  return authHttp.delete(`/api/problems/${problemId}/testcases/delete/`);
};
