<template>
  <el-card class="submission-detail-card" shadow="hover">
    <template #header>
      <div class="card-header">
        <div class="submission-title">
          <span class="submission-id">提交 #{{ submissionData.id }}</span>
          <el-tag 
            :type="getResultType(submissionData.result)" 
            size="large"
            style="margin-left: 15px;"
          >
            {{ submissionData.result_display || submissionData.result }}
          </el-tag>
          <span v-if="submissionData.score !== undefined" style="margin-left: 10px;">
            得分: {{ submissionData.score }}
          </span>
        </div>
        <el-button type="primary" size="small" @click="goBack">
          返回
        </el-button>
      </div>
    </template>
    
    <el-skeleton v-if="loading" :rows="8" animated />
    
    <div v-else class="submission-content">
      <!-- 基本信息 -->
      <el-descriptions :column="3" border class="info-descriptions">
        <el-descriptions-item label="题目">
          <el-link type="primary" @click="goToProblem">
            {{ submissionData.problem?.title }}
          </el-link>
        </el-descriptions-item>
        <el-descriptions-item label="用户">
          {{ submissionData.user?.username }}
        </el-descriptions-item>
        <el-descriptions-item label="语言">
          {{ submissionData.language }}
        </el-descriptions-item>
        <el-descriptions-item label="代码长度">
          {{ submissionData.code_length }} 字节
        </el-descriptions-item>
        <el-descriptions-item label="执行时间">
          {{ submissionData.execution_time ? submissionData.execution_time + 'ms' : '-' }}
        </el-descriptions-item>
        <el-descriptions-item label="内存使用">
          {{ submissionData.memory_usage ? submissionData.memory_usage + 'KB' : '-' }}
        </el-descriptions-item>
        <el-descriptions-item label="提交时间" :span="3">
          {{ formatDate(submissionData.submit_time) }}
        </el-descriptions-item>
        <el-descriptions-item label="评测时间" :span="3" v-if="submissionData.judge_time">
          {{ formatDate(submissionData.judge_time) }}
        </el-descriptions-item>
      </el-descriptions>
      
      <!-- 测试点结果 -->
      <div v-if="submissionData.test_case_results && submissionData.test_case_results.length > 0" class="test-results">
        <h3>📋 测试点详情</h3>
        <el-table 
          :data="submissionData.test_case_results" 
          stripe
          size="small"
        >
          <el-table-column prop="test_case_id" label="测试点" width="100" />
          <el-table-column label="结果" width="150">
            <template #default="scope">
              <el-tag 
                :type="getResultType(scope.row.status)" 
                size="small"
              >
                {{ scope.row.status }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="execution_time" label="执行时间" width="120">
            <template #default="scope">
              {{ scope.row.execution_time ? scope.row.execution_time + 'ms' : '-' }}
            </template>
          </el-table-column>
          <el-table-column prop="memory_usage" label="内存使用" width="120">
            <template #default="scope">
              {{ scope.row.memory_usage ? scope.row.memory_usage + 'KB' : '-' }}
            </template>
          </el-table-column>
          <el-table-column prop="score" label="得分" width="100" />
          <el-table-column prop="message" label="信息" min-width="200">
            <template #default="scope">
              {{ scope.row.message || '-' }}
            </template>
          </el-table-column>
        </el-table>
      </div>
      
      <!-- 代码展示 -->
      <div class="code-section">
        <h3>💻 源代码</h3>
        <el-input
          v-model="submissionData.code"
          type="textarea"
          :rows="20"
          readonly
          class="code-editor"
        />
      </div>
    </div>
  </el-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useSubmissionStore } from '@/stores/submission'

const props = defineProps({
  submissionId: {
    type: [String, Number],
    required: true
  }
})

const emit = defineEmits(['go-back', 'view-problem'])

const submissionStore = useSubmissionStore()

// 响应式数据
const loading = ref(true)
const submissionData = ref({})

// 获取提交详情
const fetchSubmissionDetail = async () => {
  loading.value = true
  try {
    const data = await submissionStore.fetchSubmissionDetail(props.submissionId)
    submissionData.value = data
  } catch (error) {
    ElMessage.error('获取提交详情失败')
    console.error(error)
  } finally {
    loading.value = false
  }
}

// 返回
const goBack = () => {
  emit('go-back')
}

// 跳转到题目
const goToProblem = () => {
  if (submissionData.value.problem?.problem_id) {
    emit('view-problem', submissionData.value.problem.problem_id)
  }
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
  fetchSubmissionDetail()
})
</script>

<style scoped>
.submission-detail-card {
  margin: 20px;
  max-width: 1200px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.submission-title {
  display: flex;
  align-items: center;
  font-size: 18px;
  font-weight: 600;
}

.submission-id {
  color: #303133;
}

.submission-content {
  margin-top: 20px;
}

.info-descriptions {
  margin-bottom: 30px;
}

.test-results {
  margin: 30px 0;
}

.test-results h3 {
  margin-bottom: 15px;
  color: #303133;
  font-size: 16px;
}

.code-section {
  margin-top: 30px;
}

.code-section h3 {
  margin-bottom: 15px;
  color: #303133;
  font-size: 16px;
}

.code-editor {
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 14px;
}

:deep(.code-editor textarea) {
  font-family: inherit;
  background-color: #f5f7fa;
}
</style>
