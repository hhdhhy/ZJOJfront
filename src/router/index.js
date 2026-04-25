import { createRouter, createWebHashHistory } from 'vue-router'
import login from "@/views/login/login.vue"
import register from "@/views/login/register.vue"
import forgotPassword from "@/views/login/forgot-password.vue"
import frame from "@/views/main/frame.vue"
import { useAuthStore } from "@/stores/auth"

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'frame',
      component: frame,
    },
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/register',
      name: 'register',
      component: register
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      component: forgotPassword
    },
  ],
})

// 全局前置守卫 - 检查用户登录状态
router.beforeEach((to, from) => {
  const authStore = useAuthStore()
  
  // 如果用户已登录
  if (authStore.is_login) {
    // 如果目标是登录或注册页，则重定向到主页
    if (to.name === 'login' || to.name === 'register') {
      return { name: 'frame' }
    }
    // 已登录且目标不是登录/注册页，直接放行
    return
  } else {
    // 用户未登录
    // 如果目标是需要认证的页面（非登录/注册），则重定向到登录页
    if (to.name !== 'login' && to.name !== 'register') {
      return { name: 'login' }
    }
    // 目标是登录或注册页，直接放行
    return
  }
})

export default router