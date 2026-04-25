<script setup>
import { ref, onMounted } from 'vue'
import { getClassList } from '@/api/modules/class'
import { ElMessage } from 'element-plus'

const loading = ref(false)
const classList = ref([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(20)

// 获取班级列表
const fetchClassList = async () => {
  loading.value = true
  try {
    const res = await getClassList({
      page: currentPage.value,
      page_size: pageSize.value
    })
    classList.value = res.data.results || []
    total.value = res.data.count || 0
  } catch (err) {
    ElMessage.error('获取班级列表失败')
    console.error(err)
  } finally {
    loading.value = false
  }
}

// 页码变化
const handlePageChange = (page) => {
  currentPage.value = page
  fetchClassList()
}

onMounted(() => {
  fetchClassList()
})
</script>

<template>
  <div class="class-list-container">
    <div class="page-header">
      <h2>班级管理</h2>
    </div>

    <el-table 
      v-loading="loading" 
      :data="classList" 
      style="width: 100%"
      empty-text="暂无班级数据"
    >
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="name" label="班级名称" min-width="200" />
      <el-table-column label="教练" width="150">
        <template #default="{ row }">
          {{ row.coach?.realname || row.coach?.username || '-' }}
        </template>
      </el-table-column>
      <el-table-column prop="member_count" label="成员数" width="100" />
      <el-table-column prop="created_at" label="创建时间" width="180">
        <template #default="{ row }">
          {{ new Date(row.created_at).toLocaleString('zh-CN') }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120" fixed="right">
        <template #default="{ row }">
          <el-button 
            type="primary" 
            size="small"
            @click="$emit('view-class', row.id)"
          >
            查看详情
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
  </div>
</template>

<style scoped>
.class-list-container {
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  min-height: calc(100vh - 140px);
}

.page-header {
  margin-bottom: 20px;
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
