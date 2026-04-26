<script setup>
import { ref, onMounted, computed } from 'vue'
import { getKnowledgeList, createKnowledge, deleteKnowledge } from '@/api/modules/ai'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

// 检查是否为教练或管理员
const isCoachOrAdmin = computed(() => {
  return authStore.user?.role >= 2
})

const loading = ref(false)
const knowledgeList = ref([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(20)
const showCreateDialog = ref(false)
const submitting = ref(false)  // 防止重复提交
const deleting = ref(false)  // 防止重复删除

// 表单数据
const form = ref({
  title: '',
  content: '',
  doc_type: 'algorithm',
  tag_names: [],
  error_type: ''
})

// 文档类型选项
const docTypeOptions = [
  { label: '算法教程', value: 'algorithm' },
  { label: '解题方案', value: 'solution' },
  { label: '代码模板', value: 'template' },
  { label: '概念说明', value: 'concept' },
  { label: '错误解决方案', value: 'error_solution' }
]

// 错误类型选项
const errorTypeOptions = [
  { label: 'WA (答案错误)', value: 'WA' },
  { label: 'TLE (超时)', value: 'TLE' },
  { label: 'MLE (内存超限)', value: 'MLE' },
  { label: 'RE (运行错误)', value: 'RE' },
  { label: 'CE (编译错误)', value: 'CE' }
]

// 获取知识库列表
const fetchKnowledgeList = async () => {
  loading.value = true
  try {
    const res = await getKnowledgeList({
      page: currentPage.value,
      page_size: pageSize.value
    })
    console.log('知识库列表响应:', res.data)
    
    // 后端返回格式: {code, message, data: {count, page, page_size, results: []}}
    const responseData = res.data.data || res.data
    knowledgeList.value = responseData.results || []
    total.value = responseData.count || 0
    
    console.log('解析后的数据:', {
      list: knowledgeList.value,
      total: total.value,
      firstItem: knowledgeList.value[0]
    })
  } catch (err) {
    ElMessage.error('获取知识库列表失败')
    console.error('获取知识库列表错误:', err)
  } finally {
    loading.value = false
  }
}

// 创建知识库文档
const handleCreate = async () => {
  // 防止重复提交
  if (submitting.value) {
    ElMessage.warning('正在提交中,请勿重复操作')
    return
  }
  
  if (!form.value.title || !form.value.content) {
    ElMessage.warning('请填写标题和内容')
    return
  }

  submitting.value = true
  try {
    await createKnowledge(form.value)
    ElMessage.success('创建成功')
    showCreateDialog.value = false
    resetForm()
    fetchKnowledgeList()
  } catch (err) {
    // 显示后端返回的具体错误信息
    let errorMsg = '创建失败'
    if (err.response?.data?.message) {
      errorMsg = err.response.data.message
    }
    ElMessage.error(errorMsg)
    console.error('创建知识库文档错误:', err)
  } finally {
    submitting.value = false  // 无论成功失败都释放锁
  }
}

// 删除知识库文档
const handleDelete = async (id) => {
  // 防止重复删除
  if (deleting.value) {
    ElMessage.warning('正在删除中,请勿重复操作')
    return
  }
  
  try {
    await ElMessageBox.confirm('确定要删除该文档吗?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    deleting.value = true
    await deleteKnowledge(id)
    ElMessage.success('删除成功')
    fetchKnowledgeList()
  } catch (err) {
    if (err !== 'cancel') {
      // 显示后端返回的具体错误信息
      let errorMsg = '删除失败'
      if (err.response?.status === 404) {
        errorMsg = '删除接口不可用,请联系管理员检查后端配置'
      } else if (err.response?.data?.message) {
        errorMsg = err.response.data.message
      }
      ElMessage.error(errorMsg)
      console.error('删除知识库文档错误:', err)
    }
  } finally {
    deleting.value = false  // 无论成功失败都释放锁
  }
}

// 重置表单
const resetForm = () => {
  form.value = {
    title: '',
    content: '',
    doc_type: 'algorithm',
    tag_names: [],
    error_type: ''
  }
}

// 页码变化
const handlePageChange = (page) => {
  currentPage.value = page
  fetchKnowledgeList()
}

onMounted(() => {
  fetchKnowledgeList()
})
</script>

<template>
  <div class="knowledge-container">
    <div class="page-header">
      <h2>知识库管理</h2>
      <el-button v-if="isCoachOrAdmin" type="primary" @click="showCreateDialog = true">新建文档</el-button>
    </div>

    <el-table 
      v-loading="loading" 
      :data="knowledgeList" 
      style="width: 100%"
      empty-text="暂无知识库文档"
    >
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="title" label="标题" min-width="200" />
      <el-table-column prop="doc_type" label="类型" width="120">
        <template #default="{ row }">
          <el-tag size="small">{{ row.doc_type }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="error_type" label="错误类型" width="100">
        <template #default="{ row }">
          {{ row.error_type || '-' }}
        </template>
      </el-table-column>
      <el-table-column prop="created_at" label="创建时间" width="180">
        <template #default="{ row }">
          {{ new Date(row.created_at).toLocaleString('zh-CN') }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150" fixed="right" v-if="isCoachOrAdmin">
        <template #default="{ row }">
          <el-button 
            type="danger" 
            size="small"
            :loading="deleting"
            :disabled="deleting"
            @click="handleDelete(row.id)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination
        v-model:current-page="currentPage"
        :page-size="pageSize"
        :total="total"
        layout="total, prev, pager, next"
        @current-change="handlePageChange"
      />
    </div>

    <!-- 创建对话框 -->
    <el-dialog
      v-model="showCreateDialog"
      title="新建知识库文档"
      width="600px"
    >
      <el-form :model="form" label-width="100px">
        <el-form-item label="标题" required>
          <el-input v-model="form.title" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="内容" required>
          <el-input
            v-model="form.content"
            type="textarea"
            :rows="6"
            placeholder="请输入内容（支持Markdown）"
          />
        </el-form-item>
        <el-form-item label="文档类型" required>
          <el-select v-model="form.doc_type" placeholder="请选择类型">
            <el-option
              v-for="item in docTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="错误类型" v-if="form.doc_type === 'error_solution'">
          <el-select v-model="form.error_type" placeholder="请选择错误类型">
            <el-option
              v-for="item in errorTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="标签">
          <el-input v-model="form.tag_names" placeholder="输入标签，用逗号分隔" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showCreateDialog = false" :disabled="submitting">取消</el-button>
        <el-button type="primary" @click="handleCreate" :loading="submitting">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.knowledge-container {
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  min-height: calc(100vh - 140px);
}

.page-header {
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-header h2 {
  margin: 0;
  font-size: 24px;
  color: #303133;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>
