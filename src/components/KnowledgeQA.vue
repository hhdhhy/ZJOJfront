<template>
  <el-card>
    <template #header>
      <div class="card-header">
        <span>知识问答</span>
        <el-button type="primary">提问</el-button>
      </div>
    </template>
    
    <div class="qa-list">
      <el-card v-for="item in qaList" :key="item.id" class="qa-item">
        <div class="qa-header">
          <h4>{{ item.title }}</h4>
          <el-tag :type="item.status === 'resolved' ? 'success' : 'warning'">
            {{ item.status === 'resolved' ? '已解决' : '待解决' }}
          </el-tag>
        </div>
        <div class="qa-content">
          <p>{{ item.content }}</p>
          <div class="qa-meta">
            <span>提问者: {{ item.author }}</span>
            <span>时间: {{ item.date }}</span>
            <span>回复: {{ item.replies }} 条</span>
          </div>
        </div>
      </el-card>
    </div>
  </el-card>
</template>

<script setup>
import { ref } from 'vue'

const qaList = ref([
  { id: 1, title: '动态规划怎么学', content: '刚接触动态规划，感觉很难理解，有什么好的学习方法吗？', author: 'user1', date: '2023-05-01', replies: 5, status: 'resolved' },
  { id: 2, title: 'JavaScript中闭包的概念', content: '谁能详细解释一下JavaScript中的闭包概念和应用场景？', author: 'user2', date: '2023-05-02', replies: 3, status: 'pending' },
  { id: 3, title: 'React Hooks最佳实践', content: '在使用React Hooks时有哪些需要注意的最佳实践？', author: 'user3', date: '2023-05-03', replies: 7, status: 'resolved' }
])
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.qa-item {
  margin-bottom: 15px;
}

.qa-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.qa-header h4 {
  margin: 0;
}

.qa-content p {
  margin: 10px 0;
  color: #606266;
}

.qa-meta {
  display: flex;
  justify-content: space-between;
  color: #909399;
  font-size: 12px;
}
</style>