import { createRouter, createWebHashHistory } from 'vue-router'
import login from "@/views/login/login.vue"
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
  ],
})

// 全局前置守卫 - 检查用户登录状态
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  // 如果目标路由是登录页，直接放行
  if (to.name === 'login') {
    next()
    return
  }
  
  // 检查用户是否已登录（是否有 token）
  if (authStore.token) {
    // 已登录，允许访问
    next()
  } else {
    // 未登录，重定向到登录页
    next({ name: 'login' })
  }
})

export default router