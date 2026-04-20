<template>
  <el-aside :width="sidebarWidth" class="sidebar" :class="{ collapsed: sidebarCollapsed }">
    <el-scrollbar>
      <el-menu :default-active="activeMenu" :collapse="sidebarCollapsed" :collapse-transition="false"
        class="sidebar-menu" @select="$emit('menu-select', $event)">
        <el-menu-item index="home">
          <el-icon>
            <HomeFilled />
          </el-icon>
          <template #title>首页</template>
        </el-menu-item>

        <el-menu-item index="problems">
          <el-icon>
            <List />
          </el-icon>
          <template #title>题目列表</template>
        </el-menu-item>
        
        <el-menu-item index="create-problem">
          <el-icon>
            <Plus />
          </el-icon>
          <template #title>创建题目</template>
        </el-menu-item>
        
        <el-menu-item index="contest">
          <el-icon>
            <Medal />
          </el-icon>
          <template #title>竞赛</template>
        </el-menu-item>

        <el-menu-item index="status">
          <el-icon>
            <Document />
          </el-icon>
          <template #title>评测状态</template>
        </el-menu-item>

        <el-menu-item index="qa">
          <el-icon>
            <ChatLineRound />
          </el-icon>
          <template #title>知识问答</template>
        </el-menu-item>

        <el-menu-item index="profile">
          <el-icon>
            <User />
          </el-icon>
          <template #title>我的信息</template>
        </el-menu-item>
      </el-menu>
    </el-scrollbar>
  </el-aside>
</template>

<script setup>
import { computed } from 'vue'
import {
  HomeFilled,
  User,
  List,
  ChatLineRound,
  Document,
  Medal,
  Plus
} from '@element-plus/icons-vue'

const props = defineProps({
  sidebarCollapsed: Boolean,
  activeMenu: String
})

defineEmits(['menu-select'])

const sidebarWidth = computed(() => {
  return props.sidebarCollapsed ? '64px' : '200px'
})
</script>

<style scoped>
.sidebar {
  background: linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  height: calc(100vh - 60px);
  box-shadow: 2px 0 12px rgba(0, 0, 0, 0.08);
  border-right: 1px solid rgba(0, 0, 0, 0.05);
}

.sidebar.collapsed {
  width: 64px;
}

.sidebar-menu {
  border: none;
  height: 100%;
  background: transparent;
}

:deep(.el-menu-item) {
  margin: 8px 12px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

:deep(.el-menu-item:hover) {
  background: linear-gradient(90deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  transform: translateX(4px);
}

:deep(.el-menu-item.is-active) {
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

:deep(.el-menu-item.is-active .el-icon) {
  color: white;
}

:deep(.el-scrollbar__wrap) {
  overflow-x: hidden;
}
</style>