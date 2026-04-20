import http from './http';
import { useAuthStore } from '@/stores/auth';
import { ElMessage } from 'element-plus';

// 创建一个独立的axios实例,继承自基础http实例
const authHttp = http;

// 添加请求拦截器
authHttp.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore();
    const token = authStore.token;
    if (token) {
      // 根据API文档,请求头格式为: Authorization: jwt <token>
      config.headers.Authorization = `jwt ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 添加响应拦截器
authHttp.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token 无效或已过期
      const authStore = useAuthStore();
      authStore.clearUserToken();
      ElMessage.error('登录已过期,请重新登录');
      // 使用window.location进行重定向,避免在拦截器中使用router
      window.location.href = '#/login';
    }
    return Promise.reject(error);
  }
);

export default authHttp;