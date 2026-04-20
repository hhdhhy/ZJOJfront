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
  background-color: #fff;
  padding: 0 20px;
  border-bottom: 1px solid #dcdfe6;
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
}

.logo {
  font-size: 20px;
  font-weight: bold;
  color: #409EFF;
}

.nav-right {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 6px 12px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.user-info:hover {
  background-color: #f5f7fa;
}

.avatar {
  margin-right: 10px;
}

.username {
  margin-right: 8px;
  color: #606266;
}

.ml-4 {
  margin-left: 4px;
  color: #909399;
}
</style>