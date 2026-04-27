<template>
  <el-card class="submission-detail-card" :shadow="'never'">
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
        <h3>测试点详情</h3>
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
      
      <!-- 错误解决方案 -->
      <div v-if="submissionData.result !== 'AC'" class="solution-section">
        <el-button 
          type="warning" 
          size="small" 
          @click="fetchErrorSolutions"
          :loading="solutionLoading"
        >
          查看错误解决方案
        </el-button>
        
        <div v-if="showSolutions && errorSolutions.length > 0" class="solutions-content">
          <h3>💡 错误解决方案</h3>
          <el-card 
            v-for="(solution, index) in errorSolutions" 
            :key="index" 
            class="solution-card"
            :shadow="'hover'"
          >
            <h4>{{ solution.title }}</h4>
            <div class="solution-text markdown-body" v-html="renderMarkdown(solution.content)"></div>
            <div class="solution-meta">
              <el-tag v-if="solution.relevance_score !== undefined && solution.relevance_score !== null" size="small">相似度: {{ (solution.relevance_score * 100).toFixed(0) }}%</el-tag>
            </div>
          </el-card>
        </div>
        <el-empty v-else-if="showSolutions" description="未找到相关解决方案" />
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
import { getErrorSolution } from '@/api/modules/ai'
import { marked } from 'marked'

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
const errorSolutions = ref([])
const showSolutions = ref(false)
const solutionLoading = ref(false)

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

// 渲染Markdown
const renderMarkdown = (content) => {
  if (!content) return ''
  return marked.parse(content)
}

// 获取错误解决方案
const fetchErrorSolutions = async () => {
  solutionLoading.value = true
  try {
    const res = await getErrorSolution(props.submissionId)
    console.log('API返回数据:', res.data)
    errorSolutions.value = res.data.solutions || []
    console.log('解决方案数量:', errorSolutions.value.length)
    if (errorSolutions.value.length > 0) {
      console.log('第一个解决方案:', errorSolutions.value[0])
    }
    showSolutions.value = true
  } catch (err) {
    ElMessage.error('获取错误解决方案失败')
    console.error('错误详情:', err)
  } finally {
    solutionLoading.value = false
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

.solution-section {
  margin: 30px 0;
}

.solutions-content {
  margin-top: 20px;
}

.solutions-content h3 {
  margin-bottom: 15px;
  font-size: 18px;
  color: #303133;
}

.solution-card {
  margin-bottom: 15px;
}

.solution-card h4 {
  margin: 0 0 10px 0;
  font-size: 16px;
  color: #409EFF;
}

.solution-text {
  line-height: 1.6;
  color: #606266;
  margin-bottom: 10px;
}

/* Markdown样式 */
.solution-text.markdown-body {
  font-size: 14px;
}

.solution-text.markdown-body h1,
.solution-text.markdown-body h2,
.solution-text.markdown-body h3,
.solution-text.markdown-body h4,
.solution-text.markdown-body h5,
.solution-text.markdown-body h6 {
  margin-top: 16px;
  margin-bottom: 10px;
  font-weight: 600;
  line-height: 1.25;
}

.solution-text.markdown-body p {
  margin-bottom: 10px;
}

.solution-text.markdown-body code {
  background-color: #f6f8fa;
  padding: 0.2em 0.4em;
  border-radius: 3px;
  font-size: 85%;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
}

.solution-text.markdown-body pre {
  background-color: #f6f8fa;
  padding: 16px;
  border-radius: 6px;
  overflow: auto;
  margin-bottom: 10px;
}

.solution-text.markdown-body pre code {
  background-color: transparent;
  padding: 0;
  font-size: 100%;
}

.solution-text.markdown-body ul,
.solution-text.markdown-body ol {
  padding-left: 2em;
  margin-bottom: 10px;
}

.solution-text.markdown-body li {
  margin-bottom: 5px;
}

.solution-text.markdown-body strong {
  font-weight: 600;
  color: #303133;
}

.solution-text.markdown-body blockquote {
  border-left: 4px solid #dfe2e5;
  padding-left: 16px;
  margin: 10px 0;
  color: #6a737d;
}

.solution-meta {
  display: flex;
  justify-content: flex-end;
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
