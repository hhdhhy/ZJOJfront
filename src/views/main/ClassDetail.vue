<script setup>
import { ref, onMounted } from 'vue'
import { getClassDetail, getClassMembers, removeClassMember } from '@/api/modules/class'
import { ElMessage, ElMessageBox } from 'element-plus'

const props = defineProps({
  classId: Number
})

const emit = defineEmits(['back'])

const loading = ref(false)
const classInfo = ref(null)
const members = ref([])
const memberTotal = ref(0)
const currentPage = ref(1)
const pageSize = ref(20)

// 获取班级详情
const fetchClassDetail = async () => {
  try {
    const res = await getClassDetail(props.classId)
    classInfo.value = res.data
  } catch (err) {
    ElMessage.error('获取班级详情失败')
    console.error(err)
  }
}

// 获取成员列表
const fetchMembers = async () => {
  loading.value = true
  try {
    const res = await getClassMembers(props.classId, {
      page: currentPage.value,
      page_size: pageSize.value
    })
    members.value = res.data.results || []
    memberTotal.value = res.data.count || 0
  } catch (err) {
    ElMessage.error('获取成员列表失败')
    console.error(err)
  } finally {
    loading.value = false
  }
}

// 移除成员
const handleRemoveMember = async (userId) => {
  try {
    await ElMessageBox.confirm('确定要移除该成员吗?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    await removeClassMember(props.classId, userId)
    ElMessage.success('移除成功')
    fetchMembers()
  } catch (err) {
    if (err !== 'cancel') {
      ElMessage.error('移除失败')
      console.error(err)
    }
  }
}

// 页码变化
const handlePageChange = (page) => {
  currentPage.value = page
  fetchMembers()
}

onMounted(() => {
  fetchClassDetail()
  fetchMembers()
})
</script>

<template>
  <div class="class-detail-container">
    <div class="page-header">
      <el-button @click="$emit('back')" size="small">返回</el-button>
      <h2>{{ classInfo?.name || '班级详情' }}</h2>
    </div>

    <!-- 班级信息 -->
    <el-card class="info-card" v-if="classInfo">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="班级名称">{{ classInfo.name }}</el-descriptions-item>
        <el-descriptions-item label="成员数">{{ classInfo.member_count }}</el-descriptions-item>
        <el-descriptions-item label="教练">
          {{ classInfo.coach?.realname || classInfo.coach?.username || '-' }}
        </el-descriptions-item>
        <el-descriptions-item label="创建时间">
          {{ new Date(classInfo.created_at).toLocaleString('zh-CN') }}
        </el-descriptions-item>
        <el-descriptions-item label="描述" :span="2">
          {{ classInfo.description || '暂无描述' }}
        </el-descriptions-item>
      </el-descriptions>
    </el-card>

    <!-- 成员列表 -->
    <div class="members-section">
      <h3>成员列表</h3>
      <el-table 
        v-loading="loading" 
        :data="members" 
        style="width: 100%"
        empty-text="暂无成员"
      >
        <el-table-column label="用户名" width="150">
          <template #default="{ row }">
            {{ row.user?.username || '-' }}
          </template>
        </el-table-column>
        <el-table-column label="姓名" width="150">
          <template #default="{ row }">
            {{ row.user?.realname || '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="role" label="角色" width="100">
          <template #default="{ row }">
            <el-tag :type="row.role === 'coach' ? 'success' : 'info'" size="small">
              {{ row.role === 'coach' ? '教练' : '学生' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="joined_at" label="加入时间" width="180">
          <template #default="{ row }">
            {{ new Date(row.joined_at).toLocaleString('zh-CN') }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100" fixed="right">
          <template #default="{ row }">
            <el-button 
              type="danger" 
              size="small"
              @click="handleRemoveMember(row.user?.uid)"
            >
              移除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          :page-size="pageSize"
          :total="memberTotal"
          layout="total, prev, pager, next"
          @current-change="handlePageChange"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.class-detail-container {
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  min-height: calc(100vh - 140px);
}

.page-header {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.page-header h2 {
  margin: 0;
  font-size: 24px;
  color: #303133;
}

.info-card {
  margin-bottom: 30px;
}

.members-section h3 {
  margin-bottom: 15px;
  font-size: 18px;
  color: #303133;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>
