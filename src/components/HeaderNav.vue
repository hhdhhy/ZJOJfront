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
      <span class="username">{{ userInfo.username || '用户' }}</span>
    </div>
  </div>
</template>

<script setup>
import { Fold, Expand } from '@element-plus/icons-vue'

defineProps({
  sidebarCollapsed: Boolean,
  userInfo: Object
})

defineEmits(['toggle-sidebar'])
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