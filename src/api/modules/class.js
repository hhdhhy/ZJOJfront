import authHttp from '../authHttp';

/**
 * 班级管理相关API
 */

// 获取班级列表
export const getClassList = (params = {}) => {
  return authHttp.get('/api/classes/', { params });
};

// 创建班级
export const createClass = (data) => {
  return authHttp.post('/api/classes/', data);
};

// 获取班级详情
export const getClassDetail = (classId) => {
  return authHttp.get(`/api/classes/${classId}/`);
};

// 获取班级成员列表
export const getClassMembers = (classId, params = {}) => {
  return authHttp.get(`/api/classes/${classId}/members/`, { params });
};

// 添加班级成员
export const addClassMember = (classId, data) => {
  return authHttp.post(`/api/classes/${classId}/members/`, data);
};

// 移除班级成员
export const removeClassMember = (classId, userId) => {
  return authHttp.delete(`/api/classes/${classId}/members/${userId}/`);
};
