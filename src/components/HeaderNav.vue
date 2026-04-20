<template>
  <div class="header">
    <div class="nav-left">
      <el-button link @click="$emit('toggle-sidebar')" class="sidebar-toggle">
        <el-icon :size="20">
          <Fold v-if="!sidebarCollapsed" />
          <Expand v-else />
        </el-icon>
      </el-button>
      <div class="logo">
        <span>ZJOJ</span>
      </div>
    </div>
    
    <div class="nav-right">
      <el-dropdown placement="bottom-end">
        <div class="user-info">
          <el-avatar :size="40" :src="avatarUrl" class="avatar" />
          <span class="username">{{ userInfo.username || '用户' }}</span>
          <el-icon class="ml-4"><ArrowDown /></el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="$emit('view-profile')">个人信息</el-dropdown-item>
            <el-dropdown-item @click="$emit('settings')">设置</el-dropdown-item>
            <el-dropdown-item @click="$emit('logout')" divided>退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Fold, Expand, ArrowDown } from '@element-plus/icons-vue'
import avatarImg from '@/assets/img/zjoj.png'

defineProps({
  sidebarCollapsed: Boolean,
  userInfo: Object
})

defineEmits(['toggle-sidebar', 'view-profile', 'settings', 'logout'])

// 使用本地图片，防止外部链接无法访问
const avatarUrl = ref(avatarImg)
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  padding: 0 24px;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
  z-index: 100;
  height: 60px;
}

.nav-left {
  display: flex;
  align-items: center;
}

.sidebar-toggle {
  margin-right: 15px;
  font-size: 18px;
  color: white;
  transition: all 0.3s ease;
}

.sidebar-toggle:hover {
  transform: scale(1.1);
  color: rgba(255, 255, 255, 0.9);
}

.logo {
  font-size: 24px;
  font-weight: 700;
  color: white;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  letter-spacing: 1px;
}

.nav-right {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 8px 16px;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.user-info:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.avatar {
  margin-right: 10px;
  border: 2px solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.username {
  margin-right: 8px;
  color: white;
  font-weight: 500;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.ml-4 {
  margin-left: 4px;
  color: white;
}

:deep(.el-dropdown-menu__item) {
  transition: all 0.2s ease;
}

:deep(.el-dropdown-menu__item:hover) {
  background: linear-gradient(90deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  color: #667eea;
}
</style>