<template>
  <el-card class="problem-create-card" shadow="hover">
    <template #header>
      <div class="card-header">
        <span class="card-title">📝 创建新题目</span>
      </div>
    </template>
    
    <el-skeleton v-if="loading" :rows="6" animated />
    
    <el-form 
      v-else 
      ref="createFormRef"
      :model="createForm"
      :rules="createRules"
      label-position="top"
      class="create-form"
    >
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="题目编号" prop="problem_id">
            <el-input 
              v-model="createForm.problem_id" 
              placeholder="例如: P1001"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="题目标题" prop="title">
            <el-input 
              v-model="createForm.title" 
              placeholder="请输入题目标题"
              clearable
            />
          </el-form-item>
        </el-col>
      </el-row>
      
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="时间限制 (毫秒)" prop="time_limit">
            <el-input-number 
              v-model="createForm.time_limit" 
              :min="1"
              :max="10000"
              controls-position="right"
              style="width: 100%;"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="内存限制 (MB)" prop="memory_limit">
            <el-input-number 
              v-model="createForm.memory_limit" 
              :min="1"
              :max="1024"
              controls-position="right"
              style="width: 100%;"
            />
          </el-form-item>
        </el-col>
      </el-row>
      
      <el-form-item label="标签" prop="tags">
        <el-select
          v-model="createForm.tags"
          multiple
          filterable
          allow-create
          default-first-option
          placeholder="选择或创建标签"
          style="width: 100%;"
        >
          <el-option
            v-for="tag in availableTags"
            :key="tag.id"
            :label="tag.name"
            :value="tag.id"
          />
        </el-select>
      </el-form-item>
      
      <el-form-item label="题目描述" prop="description">
        <el-input
          v-model="createForm.description"
          type="textarea"
          :rows="10"
          placeholder="支持 Markdown 格式"
          show-word-limit
        />
      </el-form-item>
      
      <el-form-item>
        <el-button 
          type="primary" 
          @click="submitCreate" 
          :loading="submitting"
          size="large"
        >
          创建题目
        </el-button>
        <el-button 
          @click="resetForm" 
          style="margin-left: 10px;"
          size="large"
        >
          重置
        </el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { createProblem, getTagList } from '@/api'

const emit = defineEmits(['create-success'])

// 表单引用
const createFormRef = ref(null)

// 响应式数据
const createForm = ref({
  problem_id: '',
  title: '',
  description: '',
  time_limit: 1000,
  memory_limit: 256,
  tags: []
})
const loading = ref(true)
const submitting = ref(false)
const availableTags = ref([])

// 表单验证规则
const createRules = {
  problem_id: [
    { required: true, message: '请输入题目编号', trigger: 'blur' },
    { pattern: /^[A-Za-z]\d+$/, message: '格式应为字母开头后跟数字，如 P1001', trigger: 'blur' }
  ],
  title: [
    { required: true, message: '请输入题目标题', trigger: 'blur' },
    { min: 1, max: 100, message: '标题长度应在 1-100 字符之间', trigger: 'blur' }
  ],
  description: [
    { required: true, message: '请输入题目描述', trigger: 'blur' },
    { min: 10, message: '描述内容不能少于 10 个字符', trigger: 'blur' }
  ],
  time_limit: [
    { required: true, message: '请输入时间限制', trigger: 'blur' },
    { type: 'number', min: 1, max: 10000, message: '时间限制应在 1-10000 毫秒之间', trigger: 'blur' }
  ],
  memory_limit: [
    { required: true, message: '请输入内存限制', trigger: 'blur' },
    { type: 'number', min: 1, max: 1024, message: '内存限制应在 1-1024 MB之间', trigger: 'blur' }
  ]
}

// 获取标签列表
const fetchTags = async () => {
  try {
    const res = await getTagList()
    availableTags.value = res.data
  } catch (error) {
    console.error('获取标签列表失败:', error)
    // 即使标签获取失败，也要继续显示表单
  } finally {
    loading.value = false
  }
}

// 提交创建题目
const submitCreate = async () => {
  if (!createFormRef.value) return
  
  await createFormRef.value.validate(async (valid) => {
    if (valid) {
      submitting.value = true
      try {
        const res = await createProblem({
          problem_id: createForm.value.problem_id,
          title: createForm.value.title,
          description: createForm.value.description,
          time_limit: createForm.value.time_limit,
          memory_limit: createForm.value.memory_limit,
          tags: createForm.value.tags
        })
        
        if (res.data.message === '题目创建成功') {
          ElMessage.success('题目创建成功！')
          // 询问用户是否要上传测试用例
          ElMessageBox.confirm(
            '题目创建成功！是否立即上传测试用例？',
            '提示',
            {
              confirmButtonText: '立即上传',
              cancelButtonText: '稍后上传',
              type: 'info'
            }
          ).then(() => {
            // 触发事件通知父组件切换到测试用例上传页面
            emit('create-success', res.data.data.problem_id)
          }).catch(() => {
            resetForm()
          })
        } else {
          ElMessage.error(res.data.message || '题目创建失败')
        }
      } catch (error) {
        ElMessage.error('题目创建失败')
        console.error(error)
      } finally {
        submitting.value = false
      }
    }
  })
}

// 重置表单
const resetForm = () => {
  if (createFormRef.value) {
    createFormRef.value.resetFields()
  }
  createForm.value = {
    problem_id: '',
    title: '',
    description: '',
    time_limit: 1000,
    memory_limit: 256,
    tags: []
  }
}

// 初始化
onMounted(() => {
  fetchTags()
})
</script>

<style scoped>
.problem-create-card {
  margin: 20px;
  max-width: 800px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.create-form {
  margin-top: 20px;
}

:deep(.el-skeleton__item) {
  height: 40px !important;
  margin-bottom: 16px;
}
</style>