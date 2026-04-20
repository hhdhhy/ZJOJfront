import authHttp from '../authHttp';

/**
 * 用户认证相关API
 */

// 用户登录
export const login = (data) => {
  return authHttp.post('/api/login/', data);
};

// 用户注册
export const register = (data) => {
  return authHttp.post('/api/register/', data);
};

// 获取用户信息
export const getUserProfile = () => {
  return authHttp.get('/api/user/profile/');
};

// 更新用户信息
export const updateUserProfile = (data) => {
  return authHttp.put('/api/user/profile/', data);
};

// 修改密码
export const changePassword = (data) => {
  return authHttp.post('/api/password/change/', data);
};

// 重置密码(邮件)
export const resetPassword = (data) => {
  return authHttp.post('/api/password/reset/', data);
};
