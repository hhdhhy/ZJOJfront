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
      <el-dropdown @command="handleCommand">
        <span class="username">
          {{ userInfo.username || '用户' }}
          <el-tag v-if="userInfo.is_staff" size="small" type="danger" style="margin-left: 8px;">教练</el-tag>
          <el-tag v-else-if="userInfo.is_superuser" size="small" type="warning" style="margin-left: 8px;">管理员</el-tag>
          <el-icon class="el-icon--right"><arrow-down /></el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup>
import { Fold, Expand, ArrowDown } from '@element-plus/icons-vue'
import { watch } from 'vue'

const props = defineProps({
  sidebarCollapsed: Boolean,
  userInfo: Object
})

// 调试:打印用户信息
watch(() => props.userInfo, (newVal) => {
  console.log('HeaderNav userInfo:', newVal)
}, { immediate: true, deep: true })

const emit = defineEmits(['toggle-sidebar', 'logout'])

const handleCommand = (command) => {
  if (command === 'logout') {
    emit('logout')
  }
}
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

.username {
  color: #606266;
  font-size: 14px;
}
</style>