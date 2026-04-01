<template>
  <el-card>
    <template #header>
      <div class="card-header">
        <span>题目列表</span>
        <el-input
          v-model="problemFilter"
          placeholder="搜索题目..."
          style="width: 200px;"
          clearable
        />
      </div>
    </template>
    
    <el-table :data="filteredProblems" style="width: 100%" stripe>
      <el-table-column prop="id" label="ID" width="100" />
      <el-table-column prop="title" label="标题" />
      <el-table-column prop="difficulty" label="难度" width="120">
        <template #default="scope">
          <el-tag 
            :type="getDifficultyTag(scope.row.difficulty)" 
            disable-transitions
          >
            {{ scope.row.difficulty }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="acceptanceRate" label="通过率" width="120" />
      <el-table-column prop="tags" label="标签" width="200">
        <template #default="scope">
          <el-tag 
            v-for="tag in scope.row.tags" 
            :key="tag" 
            size="small" 
            style="margin-right: 5px;"
          >
            {{ tag }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150">
        <template #default="scope">
          <el-button size="small" @click="viewProblem(scope.row)">查看</el-button>
          <el-button size="small" type="primary">提交</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'

// 题目列表
const problemFilter = ref('')
const problems = ref([
  { id: 1, title: '两数之和', difficulty: '简单', acceptanceRate: '65%', tags: ['数组', '哈希表'] },
  { id: 2, title: '三数之和', difficulty: '中等', acceptanceRate: '32%', tags: ['数组', '双指针'] },
  { id: 3, title: '最长不重复子串', difficulty: '中等', acceptanceRate: '41%', tags: ['字符串', '滑动窗口'] },
  { id: 4, title: '合并K个排序链表', difficulty: '困难', acceptanceRate: '28%', tags: ['链表', '分治'] },
  { id: 5, title: '二叉树遍历', difficulty: '中等', acceptanceRate: '55%', tags: ['树', '深度优先搜索'] },
])

// 计算属性
const filteredProblems = computed(() => {
  if (!problemFilter.value) return problems.value
  return problems.value.filter(problem => 
    problem.title.toLowerCase().includes(problemFilter.value.toLowerCase()) ||
    problem.tags.some(tag => tag.toLowerCase().includes(problemFilter.value.toLowerCase()))
  )
})

// 方法
const viewProblem = (problem) => {
  ElMessage.info(`查看题目: ${problem.title}`)
}

// 题目难度标签类型
const getDifficultyTag = (difficulty) => {
  if (difficulty === '简单') return 'success'
  if (difficulty === '困难') return 'danger'
  return 'warning'
}
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>