import axios from "axios";

// 创建一个基础的 axios 实例
const http = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  timeout: 180000, // 3分钟
});

// 添加响应拦截器
http.interceptors.response.use(
  // 对成功的响应进行处理
  (response) => {
    return response;
  },
  // 对错误的响应进行统一处理
  (error) => {
    // TODO: 这里可以添加通用的错误提示，例如使用 Element Plus 的 message 组件
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export default http;