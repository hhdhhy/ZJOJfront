<template>
  <el-card class="testcase-upload-card" shadow="hover">
    <template #header>
      <div class="card-header">
        <span class="card-title">📤 上传测试用例</span>
        <el-button 
          type="primary" 
          size="small"
          @click="goBack"
        >
          返回题目列表
        </el-button>
      </div>
    </template>
    
    <div class="upload-container">
      <el-alert 
        title="测试用例上传说明" 
        type="info" 
        :closable="false"
        style="margin-bottom: 20px;"
      >
        <template #default>
          <p>• 请上传包含 .in 和 .out 配对文件的 ZIP 压缩包</p>
          <p>• 每个输入文件必须有对应的输出文件</p>
          <p>• 系统会自动将文件转换为标准格式</p>
          <p>• 支持任意目录结构</p>
        </template>
      </el-alert>
      
      <el-upload
        ref="uploadRef"
        :action="uploadUrl"
        :headers="authHeaders"
        :show-file-list="false"
        :on-success="handleUploadSuccess"
        :on-error="handleUploadError"
        :before-upload="beforeUpload"
        :disabled="uploading"
        drag
        accept=".zip"
      >
        <el-icon class="el-icon--upload">
          <UploadFilled />
        </el-icon>
        <div class="el-upload__text">
          将 ZIP 文件拖到此处，或 <em>点击上传</em>
        </div>
        <template #tip>
          <div class="el-upload__tip">
            只能上传 ZIP 文件，且不超过 10MB
          </div>
        </template>
      </el-upload>
      
      <el-progress 
        v-if="uploading" 
        :percentage="uploadProgress" 
        style="margin-top: 20px;"
      />
      
      <!-- 测试用例信息展示 -->
      <div v-if="testcaseInfo" class="testcase-info">
        <el-divider />
        <h4>已上传的测试用例信息</h4>
        <el-descriptions :column="1" border>
          <el-descriptions-item label="题目ID">
            {{ testcaseInfo.problem_id }}
          </el-descriptions-item>
          <el-descriptions-item label="测试用例数量">
            {{ testcaseInfo.test_case_count }} 个
          </el-descriptions-item>
          <el-descriptions-item label="文件大小">
            {{ testcaseInfo.file_size }}
          </el-descriptions-item>
          <el-descriptions-item label="上传时间">
            {{ new Date().toLocaleString() }}
          </el-descriptions-item>
        </el-descriptions>
        
        <el-button 
          type="danger" 
          size="small"
          style="margin-top: 20px;"
          @click="handleDeleteTestcases"
          :loading="deleting"
        >
          删除测试用例
        </el-button>
      </div>
    </div>
  </el-card>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { UploadFilled } from '@element-plus/icons-vue'
import { useAuthStore } from '@/stores/auth'
import { uploadTestcases, getTestcaseList, deleteTestcases } from '@/api'

const props = defineProps({
  problemId: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['go-back'])

// 响应式数据
const uploading = ref(false)
const uploadProgress = ref(0)
const deleting = ref(false)
const testcaseInfo = ref(null)
const uploadRef = ref(null)

// 计算属性
const authStore = useAuthStore()
const authHeaders = computed(() => {
  return {
    Authorization: `jwt ${authStore.token}`
  }
})

const uploadUrl = computed(() => {
  return `/api/problems/${props.problemId}/testcases/upload/`
})

// 返回题目列表
const goBack = () => {
  emit('go-back')
}

// 上传前验证
const beforeUpload = (file) => {
  const isValidType = file.type === 'application/zip' || file.name.endsWith('.zip')
  const isValidSize = file.size / 1024 / 1024 < 10 // 10MB limit
  
  if (!isValidType) {
    ElMessage.error('只能上传 ZIP 文件!')
    return false
  }
  if (!isValidSize) {
    ElMessage.error('文件大小不能超过 10MB!')
    return false
  }
  
  uploading.value = true
  uploadProgress.value = 0
  return true
}

// 上传成功
const handleUploadSuccess = (response) => {
  uploading.value = false
  if (response.code === 200) {
    ElMessage.success('测试用例上传成功!')
    testcaseInfo.value = response.data
  } else {
    ElMessage.error(response.message || '上传失败')
  }
}

// 上传失败
const handleUploadError = (error) => {
  uploading.value = false
  ElMessage.error('测试用例上传失败')
  console.error(error)
}

// 获取现有测试用例信息
const fetchTestcaseInfo = async () => {
  try {
    const res = await getTestcaseList(props.problemId)
    if (res.data.code === 200 && res.data.data.has_testcases) {
      testcaseInfo.value = res.data.data
    }
  } catch (error) {
    console.error('获取测试用例信息失败:', error)
  }
}

// 删除测试用例
const handleDeleteTestcases = () => {
  ElMessageBox.confirm(
    '确定要删除所有测试用例吗？此操作不可恢复！',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    deleting.value = true
    try {
      const res = await deleteTestcases(props.problemId)
      if (res.data.code === 200) {
        ElMessage.success('测试用例已删除')
        testcaseInfo.value = null
      } else {
        ElMessage.error(res.data.message || '删除失败')
      }
    } catch (error) {
      ElMessage.error('删除失败')
      console.error(error)
    } finally {
      deleting.value = false
    }
  }).catch(() => {
    // 取消删除
  })
}

// 初始化
fetchTestcaseInfo()
</script>

<style scoped>
.testcase-upload-card {
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

.upload-container {
  padding: 20px 0;
}

.testcase-info {
  margin-top: 30px;
}
</style>