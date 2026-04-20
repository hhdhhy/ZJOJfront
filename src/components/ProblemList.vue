<template>
  <el-card class="problem-list-card">
    <template #header>
      <div class="card-header">
        <span class="card-title">📚 题目列表</span>
        <div class="search-container">
          <el-select 
            v-model="selectedTag" 
            placeholder="选择标签" 
            clearable 
            style="width: 150px; margin-right: 10px;"
            @change="fetchProblems"
          >
            <el-option 
              v-for="tag in tags" 
              :key="tag.id" 
              :label="tag.name" 
              :value="tag.id"
            />
          </el-select>
          <el-input
            v-model="searchTitle"
            placeholder="搜索题目标题..."
            style="width: 200px;"
            clearable
            @input="debouncedSearch"
          />
        </div>
      </div>
    </template>
    
    <el-skeleton v-if="loading" :rows="5" animated />
    
    <el-table 
      v-else 
      :data="problems" 
      style="width: 100%" 
      stripe
      empty-text="暂无题目数据"
    >
      <el-table-column prop="problem_id" label="题目ID" width="120" />
      <el-table-column prop="title" label="题目标题" min-width="200">
        <template #default="scope">
          <el-link 
            type="primary" 
            @click="viewProblemDetail(scope.row.problem_id)"
            style="cursor: pointer;"
          >
            {{ scope.row.title }}
          </el-link>
        </template>
      </el-table-column>
      <el-table-column prop="time_limit" label="时间限制" width="120">
        <template #default="scope">
          {{ scope.row.time_limit }}ms
        </template>
      </el-table-column>
      <el-table-column prop="memory_limit" label="内存限制" width="120">
        <template #default="scope">
          {{ scope.row.memory_limit }}MB
        </template>
      </el-table-column>
      <el-table-column prop="tags" label="标签" width="200">
        <template #default="scope">
          <el-tag 
            v-for="tag in scope.row.tags" 
            :key="tag.id" 
            size="small" 
            style="margin-right: 5px; margin-bottom: 5px;"
          >
            {{ tag.name }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="scope">
          <el-button 
            size="small" 
            type="primary"
            @click="submitProblem(scope.row)"
          >
            提交
          </el-button>
          <el-button 
            size="small" 
            type="danger"
            @click="handleDeleteProblem(scope.row)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <!-- 分页组件（如果需要） -->
    <!-- <div class="pagination-container" v-if="!loading && problems.length > 0">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total="total"
        layout="total, prev, pager, next, jumper"
        @current-change="handlePageChange"
      />
    </div> -->
  </el-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getProblemList, getTagList, deleteProblem } from '@/api'

const props = defineProps({
  // 可能需要接收父组件的方法
})

const emit = defineEmits(['view-detail'])

// 响应式数据
const problems = ref([])
const tags = ref([])
const loading = ref(true)
const searchTitle = ref('')
const selectedTag = ref(null)

// 防抖搜索
let searchTimer = null
const debouncedSearch = () => {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    fetchProblems()
  }, 300)
}

// 获取标签列表
const fetchTags = async () => {
  try {
    const res = await getTagList()
    tags.value = res.data
  } catch (error) {
    console.error('获取标签列表失败:', error)
    // 即使标签获取失败，也要继续获取题目列表
  }
}

// 获取题目列表
const fetchProblems = async () => {
  loading.value = true
  try {
    const params = {}
    if (searchTitle.value) {
      params.title = searchTitle.value
    }
    if (selectedTag.value) {
      params.tag_id = selectedTag.value
    }
    
    const res = await getProblemList(params)
    problems.value = res.data
  } catch (error) {
    ElMessage.error('获取题目列表失败')
    console.error(error)
    problems.value = []
  } finally {
    loading.value = false
  }
}

// 查看题目详情
const viewProblemDetail = (problemId) => {
  emit('view-detail', problemId)
}

// 提交代码
const submitProblem = (problem) => {
  ElMessage.info(`准备提交题目: ${problem.title}`)
  // TODO: 跳转到代码提交页面
}

// 删除题目
const handleDeleteProblem = async (problem) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除题目 "${problem.title}" 吗?此操作不可恢复!`,
      '警告',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
    
    await deleteProblem(problem.problem_id)
    ElMessage.success('题目删除成功')
    // 刷新列表
    fetchProblems()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除题目失败:', error)
      ElMessage.error(error.response?.data?.message || '删除题目失败')
    }
  }
}

// 初始化
onMounted(() => {
  fetchTags()
  fetchProblems()
})
</script>

<style scoped>
.problem-list-card {
  margin: 0;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  border: none;
  overflow: hidden;
}

.problem-list-card :deep(.el-card__header) {
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  padding: 20px 24px;
  border-bottom: none;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}

.card-title {
  font-size: 20px;
  font-weight: 600;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.search-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

:deep(.el-table) {
  border-radius: 0;
}

:deep(.el-table th) {
  background: linear-gradient(90deg, #f8f9fa 0%, #e9ecef 100%);
  color: #495057;
  font-weight: 600;
  border-bottom: 2px solid #dee2e6;
}

:deep(.el-table__row:hover) {
  background: linear-gradient(90deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
  transform: scale(1.002);
  transition: all 0.2s ease;
}

:deep(.el-button--primary) {
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  border: none;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
  transition: all 0.3s ease;
}

:deep(.el-button--primary:hover) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

:deep(.el-button--danger) {
  background: linear-gradient(90deg, #f093fb 0%, #f5576c 100%);
  border: none;
  box-shadow: 0 2px 8px rgba(245, 87, 108, 0.3);
  transition: all 0.3s ease;
}

:deep(.el-button--danger:hover) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(245, 87, 108, 0.4);
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
</style>