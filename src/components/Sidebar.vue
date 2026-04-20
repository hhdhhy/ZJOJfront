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
  background-color: #fff;
  /* 移除了黑色阴影效果 */
  transition: all 0.3s;
  height: calc(100vh - 60px);
  /* 减去header的高度 */
}

.sidebar.collapsed {
  width: 64px;
}

.sidebar-menu {
  border: none;
  height: 100%;
}

:deep(.el-scrollbar__wrap) {
  overflow-x: hidden;
}
</style>