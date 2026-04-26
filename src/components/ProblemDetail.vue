<template>
  <el-card class="problem-detail-card" :shadow="'never'">
    <template #header>
      <div class="card-header">
        <div class="problem-title">
          <span class="problem-id">{{ problemData.problem_id }}</span>
          <span class="problem-name">{{ problemData.title }}</span>
        </div>
        <div class="header-buttons">
          <el-button 
            v-if="isCreator"
            type="warning" 
            size="small"
            @click="handleDeleteProblem"
            style="margin-right: 10px;"
          >
            删除题目
          </el-button>
          <el-button 
            v-if="isCreator"
            type="primary" 
            size="small"
            @click="editProblem"
            style="margin-right: 10px;"
          >
            编辑题目
          </el-button>
          <el-button 
            type="primary" 
            size="small"
            @click="goBack"
          >
            返回题目列表
          </el-button>
        </div>
      </div>
    </template>
    
    <el-skeleton v-if="loading" :rows="8" animated />
    
    <div v-else class="problem-content">
      <!-- 题目基本信息 -->
      <div class="problem-meta">
        <el-descriptions :column="4" size="small" border>
          <el-descriptions-item label="时间限制">
            {{ problemData.time_limit }} ms
          </el-descriptions-item>
          <el-descriptions-item label="内存限制">
            {{ problemData.memory_limit }} MB
          </el-descriptions-item>
          <el-descriptions-item label="创建者">
            {{ problemData.creator_name || '未知' }}
          </el-descriptions-item>
          <el-descriptions-item label="上传时间">
            {{ formatDate(problemData.upload_time) }}
          </el-descriptions-item>
        </el-descriptions>
        
        <!-- 标签 -->
        <div v-if="problemData.tags && problemData.tags.length > 0" class="problem-tags">
          <el-tag 
            v-for="tag in problemData.tags" 
            :key="tag.id"
            size="small"
            style="margin-right: 8px; margin-top: 10px;"
          >
            {{ tag.name }}
          </el-tag>
        </div>
      </div>
      
      <!-- 题目描述 -->
      <div class="problem-description">
        <h3>题目描述</h3>
        <div 
          class="markdown-content" 
          v-html="renderMarkdown(problemData.description)"
        ></div>
      </div>
      
      <!-- 提交代码区域 -->
      <div class="submit-section">
        <h3>💻 提交代码</h3>
        <el-form 
          ref="submitFormRef"
          :model="submitForm"
          :rules="submitRules"
          label-position="top"
        >
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="编程语言" prop="language">
                <el-select 
                  v-model="submitForm.language" 
                  placeholder="请选择编程语言"
                  style="width: 100%;"
                >
                  <el-option 
                    v-for="lang in languages" 
                    :key="lang.value"
                    :label="lang.label"
                    :value="lang.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          
          <el-form-item label="源代码" prop="code">
            <el-input
              v-model="submitForm.code"
              type="textarea"
              :rows="15"
              placeholder="请输入您的代码..."
              show-word-limit
            />
          </el-form-item>
          
          <el-form-item>
            <el-button 
              type="primary" 
              @click="submitCode" 
              :loading="submitting"
              size="large"
            >
              提交代码
            </el-button>
            <el-button 
              @click="resetSubmitForm" 
              style="margin-left: 10px;"
              size="large"
            >
              重置
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </el-card>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { marked } from 'marked'
import { getProblemDetail, deleteProblem, submitCode as apiSubmitCode } from '@/api'
import { useAuthStore } from '@/stores/auth'

const props = defineProps({
  problemId: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['go-back', 'edit-problem', 'submit-success'])

const authStore = useAuthStore()

// 响应式数据
const loading = ref(true)
const submitting = ref(false)
const deleting = ref(false)  // 防止重复删除
const problemData = ref({})
const submitFormRef = ref(null)

const submitForm = ref({
  language: 'cpp',
  code: ''
})

const languages = [
  { value: 'cpp', label: 'C++' },
  { value: 'c', label: 'C' },
  { value: 'java', label: 'Java' },
  { value: 'python3', label: 'Python3' }
]

// 表单验证规则
const submitRules = {
  language: [
    { required: true, message: '请选择编程语言', trigger: 'change' }
  ],
  code: [
    { required: true, message: '请输入源代码', trigger: 'blur' },
    { min: 10, message: '代码长度不能少于 10 个字符', trigger: 'blur' }
  ]
}

// 获取题目详情
const fetchProblemDetail = async () => {
  try {
    const res = await getProblemDetail(props.problemId)
    problemData.value = res.data
  } catch (error) {
    ElMessage.error('获取题目详情失败')
    console.error(error)
  } finally {
    loading.value = false
  }
}

// 渲染 Markdown
const renderMarkdown = (content) => {
  if (!content) return ''
  return marked.parse(content)
}

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return '未知'
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN')
}

// 返回题目列表
const goBack = () => {
  emit('go-back')
}

// 获取创建者名称的辅助函数
const getCreatorName = (creator) => {
  if (!creator) return null
  
  // 如果 creator 是字符串（直接是用户名）
  if (typeof creator === 'string') {
    return creator
  }
  
  // 如果 creator 是对象，尝试多种可能的字段
  if (typeof creator === 'object') {
    // 优先使用 username
    if (creator.username) return creator.username
    // 其次使用 realname
    if (creator.realname) return creator.realname
    // 最后使用 uid（如果其他都没有）
    if (creator.uid) return creator.uid
  }
  
  return null
}

// 判断当前用户是否为题目创建者
const isCreator = computed(() => {
  // 使用 creator_name 字符串与当前用户的 username 进行比较
  return problemData.value.creator_name === authStore.user?.username
})

// 编辑题目
const editProblem = () => {
  emit('edit-problem')
}

// 删除题目
const handleDeleteProblem = async () => {
  // 防止重复删除
  if (deleting.value) {
    ElMessage.warning('正在删除中,请勿重复操作')
    return
  }
  
  try {
    await ElMessageBox.confirm(
      `确定要删除题目 "${problemData.value.title}" 吗?此操作不可恢复!`,
      '警告',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
    
    deleting.value = true
    await deleteProblem(props.problemId)
    ElMessage.success('题目删除成功')
    // 返回题目列表
    emit('go-back')
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除题目失败:', error)
      ElMessage.error(error.response?.data?.message || '删除题目失败')
    }
  } finally {
    deleting.value = false  // 无论成功失败都释放锁
  }
}

// 提交代码
const submitCode = async () => {
  if (!submitFormRef.value) return
  
  await submitFormRef.value.validate(async (valid) => {
    if (valid) {
      submitting.value = true
      try {
        const res = await apiSubmitCode({
          problem: props.problemId,
          language: submitForm.value.language,
          code: submitForm.value.code
        })
        
        if (res.data.message === '代码提交成功') {
          ElMessage.success('代码提交成功！正在跳转到评测状态页面...')
          resetSubmitForm()
          // 通知父组件跳转到评测状态页面
          emit('submit-success')
        } else {
          ElMessage.error(res.data.message || '提交失败')
        }
      } catch (error) {
        ElMessage.error('代码提交失败')
        console.error(error)
      } finally {
        submitting.value = false
      }
    }
  })
}

// 重置提交表单
const resetSubmitForm = () => {
  if (submitFormRef.value) {
    submitFormRef.value.resetFields()
  }
  submitForm.value = {
    language: 'cpp',
    code: ''
  }
}

// 初始化
fetchProblemDetail()
</script>

<style scoped>
.problem-detail-card {
  margin: 20px;
  max-width: 1200px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.problem-title {
  display: flex;
  flex-direction: column;
}

.problem-id {
  font-size: 18px;
  font-weight: 600;
  color: #409eff;
  margin-bottom: 4px;
}

.problem-name {
  font-size: 20px;
  font-weight: 700;
  color: #303133;
}

.problem-meta {
  margin: 20px 0;
}

.problem-tags {
  display: flex;
  flex-wrap: wrap;
}

.problem-description {
  margin: 30px 0;
}

.problem-description h3 {
  margin-bottom: 15px;
  color: #303133;
}

.markdown-content {
  padding: 15px;
  background-color: #f9fafb;
  border-radius: 4px;
  border: 1px solid #ebeef5;
}

.markdown-content :deep(h1),
.markdown-content :deep(h2),
.markdown-content :deep(h3),
.markdown-content :deep(h4),
.markdown-content :deep(h5),
.markdown-content :deep(h6) {
  margin-top: 0;
  margin-bottom: 16px;
  font-weight: 600;
  line-height: 1.25;
}

.markdown-content :deep(p) {
  margin-top: 0;
  margin-bottom: 16px;
}

.markdown-content :deep(code) {
  padding: 0.2em 0.4em;
  margin: 0;
  font-size: 85%;
  background-color: rgba(27,31,35,0.05);
  border-radius: 6px;
}

.markdown-content :deep(pre) {
  margin-top: 0;
  margin-bottom: 16px;
  padding: 16px;
  overflow: auto;
  background-color: #f6f8fa;
  border-radius: 6px;
}

.markdown-content :deep(pre > code) {
  padding: 0;
  margin: 0;
  font-size: 100%;
  word-break: normal;
  white-space: pre;
  background: transparent;
  border: 0;
}

.header-buttons {
  display: flex;
  gap: 10px;
}

.submit-section {
  margin-top: 40px;
  padding-top: 30px;
  border-top: 1px solid #ebeef5;
}

.submit-section h3 {
  margin-bottom: 20px;
  color: #303133;
}
</style>