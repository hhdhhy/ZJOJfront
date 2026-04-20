<template>
  <el-card class="submission-list-card">
    <template #header>
      <div class="card-header">
        <span class="card-title">评测状态</span>
        <div class="filter-container">
          <el-select 
            v-model="filterProblemId" 
            placeholder="搜索题目" 
            clearable 
            filterable
            style="width: 200px; margin-right: 10px;"
            @change="fetchSubmissions"
          >
            <el-option 
              v-for="problem in problemOptions" 
              :key="problem.problem_id" 
              :label="`${problem.problem_id} - ${problem.title}`" 
              :value="problem.problem_id"
            />
          </el-select>
          <el-select 
            v-model="filterResult" 
            placeholder="评测结果" 
            clearable 
            style="width: 120px; margin-right: 10px;"
            @change="fetchSubmissions"
          >
            <el-option label="Accepted" value="AC" />
            <el-option label="Wrong Answer" value="WA" />
            <el-option label="Time Limit Exceeded" value="TLE" />
            <el-option label="Memory Limit Exceeded" value="MLE" />
            <el-option label="Runtime Error" value="RE" />
            <el-option label="Compilation Error" value="CE" />
            <el-option label="System Error" value="SE" />
          </el-select>
          <el-button type="primary" size="small" @click="fetchSubmissions">
            刷新
          </el-button>
        </div>
      </div>
    </template>
    
    <el-skeleton v-if="loading" :rows="8" animated />
    
    <el-table 
      v-else 
      :data="submissions" 
      style="width: 100%" 
      stripe
      empty-text="暂无提交记录"
      @row-click="viewSubmissionDetail"
    >
      <el-table-column prop="id" label="提交ID" width="100" />
      <el-table-column label="题目" min-width="180">
        <template #default="scope">
          <el-link type="primary" @click.stop="goToProblem(scope.row.problem.problem_id)">
            {{ scope.row.problem.title }}
          </el-link>
        </template>
      </el-table-column>
      <el-table-column label="用户" width="120">
        <template #default="scope">
          {{ scope.row.user.username }}
        </template>
      </el-table-column>
      <el-table-column prop="language" label="语言" width="100" />
      <el-table-column label="结果" width="180">
        <template #default="scope">
          <el-tag 
            :type="getResultType(scope.row.result)" 
            disable-transitions
          >
            {{ scope.row.result_display || scope.row.result }}
          </el-tag>
          <span v-if="scope.row.score !== undefined" style="margin-left: 8px;">
            {{ scope.row.score }}分
          </span>
        </template>
      </el-table-column>
      <el-table-column label="执行时间" width="120">
        <template #default="scope">
          {{ scope.row.execution_time ? scope.row.execution_time + 'ms' : '-' }}
        </template>
      </el-table-column>
      <el-table-column label="内存使用" width="120">
        <template #default="scope">
          {{ scope.row.memory_usage ? scope.row.memory_usage + 'KB' : '-' }}
        </template>
      </el-table-column>
      <el-table-column prop="submit_time" label="提交时间" width="180">
        <template #default="scope">
          {{ formatDate(scope.row.submit_time) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100" fixed="right">
        <template #default="scope">
          <el-button 
            size="small" 
            type="primary"
            @click.stop="viewSubmissionDetail(scope.row)"
          >
            详情
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useSubmissionStore } from '@/stores/submission'
import { getProblemList } from '@/api'

const emit = defineEmits(['view-detail', 'view-problem'])

const submissionStore = useSubmissionStore()

// 响应式数据
const submissions = ref([])
const loading = ref(false)
const filterProblemId = ref('')
const filterResult = ref('')
const problemOptions = ref([])

// 获取题目列表(用于筛选)
const fetchProblemOptions = async () => {
  try {
    const res = await getProblemList()
    problemOptions.value = res.data
  } catch (error) {
    console.error('获取题目列表失败:', error)
  }
}

// 获取提交列表
const fetchSubmissions = async () => {
  loading.value = true
  try {
    const params = {}
    if (filterProblemId.value) {
      params.problem_id = filterProblemId.value
    }
    if (filterResult.value) {
      params.result = filterResult.value
    }
    
    const data = await submissionStore.fetchSubmissions(params)
    submissions.value = data
  } catch (error) {
    ElMessage.error('获取提交列表失败')
    console.error(error)
  } finally {
    loading.value = false
  }
}

// 查看提交详情
const viewSubmissionDetail = (submission) => {
  emit('view-detail', submission.id)
}

// 跳转到题目
const goToProblem = (problemId) => {
  emit('view-problem', problemId)
}

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN')
}

// 获取结果类型
const getResultType = (result) => {
  const typeMap = {
    'AC': 'success',
    'WA': 'danger',
    'TLE': 'warning',
    'MLE': 'warning',
    'RE': 'danger',
    'CE': 'info',
    'SE': 'danger'
  }
  return typeMap[result] || 'info'
}

// 初始化
onMounted(() => {
  fetchProblemOptions()
  fetchSubmissions()
})
</script>

<style scoped>
.submission-list-card {
  margin: 0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.filter-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

:deep(.el-table__row) {
  cursor: pointer;
}

:deep(.el-tag) {
  border-radius: 12px;
  padding: 4px 12px;
  font-weight: 500;
}
</style>
