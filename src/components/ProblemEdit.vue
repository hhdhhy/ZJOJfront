<template>
  <el-card class="problem-edit-card" :shadow="'never'">
    <template #header>
      <div class="card-header">
        <span class="card-title">编辑题目 - {{ problemData.problem_id }}</span>
        <el-button 
          type="primary" 
          size="small"
          @click="goBack"
        >
          返回题目详情
        </el-button>
      </div>
    </template>
    
    <el-skeleton v-if="loading" :rows="8" animated />
    
    <div v-else class="edit-form">
      <el-form 
        ref="editFormRef"
        :model="editForm"
        :rules="editRules"
        label-position="top"
        @submit.prevent
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="题目标题" prop="title">
              <el-input 
                v-model="editForm.title" 
                placeholder="请输入题目标题"
                maxlength="100"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          
          <el-col :span="12">
            <el-form-item label="时间限制 (ms)" prop="time_limit">
              <el-input-number 
                v-model="editForm.time_limit" 
                :min="100"
                :max="10000"
                controls-position="right"
                style="width: 100%;"
              />
            </el-form-item>
          </el-col>
          
          <el-col :span="12">
            <el-form-item label="内存限制 (MB)" prop="memory_limit">
              <el-input-number 
                v-model="editForm.memory_limit" 
                :min="1"
                :max="1024"
                controls-position="right"
                style="width: 100%;"
              />
            </el-form-item>
          </el-col>
          
          <el-col :span="12">
            <el-form-item label="标签" prop="tags">
              <el-select
                v-model="editForm.tags"
                multiple
                filterable
                allow-create
                default-first-option
                placeholder="请选择或创建标签"
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
          </el-col>
        </el-row>
        
        <el-form-item label="题目描述" prop="description">
          <el-input
            v-model="editForm.description"
            type="textarea"
            :rows="10"
            placeholder="请输入题目描述（支持Markdown语法）"
            show-word-limit
          />
        </el-form-item>
        
        <el-form-item>
          <el-button 
            type="primary" 
            @click="handleUpdateProblem"
            :loading="updating"
            size="large"
          >
            更新题目
          </el-button>
          <el-button 
            type="success"
            @click="goToUploadTestcase" 
            size="large"
            style="margin-left: 10px;"
          >
            上传测试用例
          </el-button>
          <el-button 
            @click="resetForm" 
            style="margin-left: 10px;"
            size="large"
          >
            重置
          </el-button>
          <el-button 
            type="danger" 
            @click="deleteProblem" 
            :loading="deleting"
            style="float: right;"
            size="large"
          >
            删除题目
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-card>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getProblemDetail, updateProblem, getTagList } from '@/api'

const props = defineProps({
  problemId: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['go-back', 'update-success', 'go-to-upload-testcase'])

// 响应式数据
const loading = ref(true)
const updating = ref(false)
const deleting = ref(false)
const editFormRef = ref(null)
const problemData = ref({})
const availableTags = ref([])

const editForm = ref({
  title: '',
  description: '',
  time_limit: 1000,
  memory_limit: 256,
  tags: []
})

// 表单验证规则
const editRules = {
  title: [
    { required: true, message: '请输入题目标题', trigger: 'blur' },
    { min: 1, max: 100, message: '标题长度在 1 到 100 个字符之间', trigger: 'blur' }
  ],
  description: [
    { required: true, message: '请输入题目描述', trigger: 'blur' },
    { min: 10, message: '描述内容不能少于 10 个字符', trigger: 'blur' }
  ],
  time_limit: [
    { required: true, message: '请输入时间限制', trigger: 'blur' },
    { type: 'number', min: 100, max: 10000, message: '时间限制应在 100-10000 ms 之间', trigger: 'blur' }
  ],
  memory_limit: [
    { required: true, message: '请输入内存限制', trigger: 'blur' },
    { type: 'number', min: 1, max: 1024, message: '内存限制应在 1-1024 MB 之间', trigger: 'blur' }
  ]
}

// 获取题目详情和标签列表
const fetchProblemAndTags = async () => {
  try {
    // 并行获取题目详情和标签列表
    const [problemRes, tagsRes] = await Promise.all([
      getProblemDetail(props.problemId),
      getTagList()
    ])
    
    problemData.value = problemRes.data
    availableTags.value = tagsRes.data
    
    // 初始化表单数据
    editForm.value = {
      title: problemRes.data.title,
      description: problemRes.data.description,
      time_limit: problemRes.data.time_limit,
      memory_limit: problemRes.data.memory_limit,
      tags: problemRes.data.tags.map(tag => tag.id)
    }
  } catch (error) {
    ElMessage.error('获取题目信息失败')
    console.error(error)
  } finally {
    loading.value = false
  }
}

// 返回题目详情
const goBack = () => {
  emit('go-back')
}

// 更新题目
const handleUpdateProblem = async () => {
  if (!editFormRef.value) return
  
  await editFormRef.value.validate(async (valid) => {
    if (valid) {
      updating.value = true
      try {
        const res = await updateProblem(props.problemId, {
          title: editForm.value.title,
          description: editForm.value.description,
          time_limit: editForm.value.time_limit,
          memory_limit: editForm.value.memory_limit,
          tags: editForm.value.tags
        })
        
        if (res.data.message === '题目更新成功') {
          ElMessage.success('题目更新成功！')
          emit('update-success', res.data.data)
        } else {
          ElMessage.error(res.data.message || '更新失败')
        }
      } catch (error) {
        ElMessage.error('题目更新失败')
        console.error(error)
      } finally {
        updating.value = false
      }
    }
  })
}

// 重置表单
const resetForm = () => {
  if (editFormRef.value) {
    editFormRef.value.resetFields()
  }
  editForm.value = {
    title: problemData.value.title,
    description: problemData.value.description,
    time_limit: problemData.value.time_limit,
    memory_limit: problemData.value.memory_limit,
    tags: problemData.value.tags.map(tag => tag.id)
  }
}

// 跳转到上传测试用例页面
const goToUploadTestcase = () => {
  emit('go-to-upload-testcase', props.problemId)
}

// 删除题目
const deleteProblem = () => {
  ElMessageBox.confirm(
    '确定要删除此题目吗？此操作不可恢复，且会删除所有相关的提交记录！',
    '警告',
    {
      confirmButtonText: '确定删除',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    deleting.value = true
    try {
      const res = await authHttp.delete(`/api/problems/${props.problemId}/`)
      if (res.data.message === '题目删除成功') {
        ElMessage.success('题目删除成功！')
        emit('go-back')
      } else {
        ElMessage.error(res.data.message || '删除失败')
      }
    } catch (error) {
      ElMessage.error('题目删除失败')
      console.error(error)
    } finally {
      deleting.value = false
    }
  }).catch(() => {
    // 取消删除
  })
}

// 初始化
fetchProblemAndTags()
</script>

<style scoped>
.problem-edit-card {
  margin: 20px;
  max-width: 1000px;
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

.edit-form {
  padding: 20px 0;
}
</style>