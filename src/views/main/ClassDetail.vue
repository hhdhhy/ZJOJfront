<script setup>
import { ref, onMounted } from 'vue'
import { getClassDetail, getClassMembers, addClassMember, removeClassMember } from '@/api/modules/class'
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

// 添加成员对话框
const addDialogVisible = ref(false)
const addForm = ref({
  username: ''
})
const adding = ref(false)

// 获取班级详情
const fetchClassDetail = async () => {
  try {
    const res = await getClassDetail(props.classId)
    console.log('[ClassDetail] 班级详情API返回:', res.data)
    classInfo.value = res.data.data || res.data
  } catch (err) {
    ElMessage.error('获取班级详情失败')
    console.error('[ClassDetail] 请求失败:', err)
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
    // 实际返回结构: {code: 200, message: "...", data: {members: [...], member_count: N}}
    const responseData = res.data.data || res.data
    members.value = responseData.members || []
    memberTotal.value = responseData.member_count || 0
  } catch (err) {
    ElMessage.error('获取成员列表失败')
    console.error('[ClassDetail] 成员列表请求失败:', err)
  } finally {
    loading.value = false
  }
}

// 打开添加成员对话框
const handleAddMember = () => {
  addForm.value = { username: '' }
  addDialogVisible.value = true
}

// 提交添加成员
const submitAddMember = async () => {
  if (!addForm.value.username.trim()) {
    ElMessage.warning('请输入用户名')
    return
  }
  
  adding.value = true
  try {
    await addClassMember(props.classId, { username: addForm.value.username })
    ElMessage.success('添加成员成功')
    addDialogVisible.value = false
    fetchMembers()
    fetchClassDetail() // 刷新班级信息(成员数)
  } catch (err) {
    ElMessage.error(err.response?.data?.message || '添加成员失败')
    console.error(err)
  } finally {
    adding.value = false
  }
}

// 移除成员
const handleRemoveMember = async (username) => {
  try {
    await ElMessageBox.confirm('确定要移除该成员吗?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    await removeClassMember(props.classId, username)
    ElMessage.success('移除成功')
    fetchMembers()
    fetchClassDetail() // 刷新班级信息(成员数)
  } catch (err) {
    if (err !== 'cancel') {
      ElMessage.error(err.response?.data?.message || '移除失败')
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
        <el-descriptions-item label="成员数">{{ classInfo.member_count || 0 }}</el-descriptions-item>
        <el-descriptions-item label="教练">
          {{ classInfo.coach || '-' }}
        </el-descriptions-item>
        <el-descriptions-item label="创建时间">
          {{ classInfo.create_time ? new Date(classInfo.create_time).toLocaleString('zh-CN') : '-' }}
        </el-descriptions-item>
        <el-descriptions-item label="描述" :span="2">
          {{ classInfo.description || '暂无描述' }}
        </el-descriptions-item>
      </el-descriptions>
    </el-card>

    <!-- 成员列表 -->
    <div class="members-section">
      <div class="members-header">
        <h3>成员列表</h3>
        <el-button type="primary" size="small" @click="handleAddMember">添加成员</el-button>
      </div>
      <el-table 
        v-loading="loading" 
        :data="members" 
        style="width: 100%"
        empty-text="暂无成员"
      >
        <el-table-column label="用户名" width="150">
          <template #default="{ row }">
            {{ row.username || '-' }}
          </template>
        </el-table-column>
        <el-table-column label="姓名" width="150">
          <template #default="{ row }">
            {{ row.realname || '-' }}
          </template>
        </el-table-column>
        <el-table-column label="角色" width="100">
          <template #default="{ row }">
            <el-tag type="info" size="small">
              学生
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="加入时间" width="180">
          <template #default="{ row }">
            {{ row.join_time ? new Date(row.join_time).toLocaleString('zh-CN') : '-' }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100" fixed="right">
          <template #default="{ row }">
            <el-button 
              type="danger" 
              size="small"
              @click="handleRemoveMember(row.username)"
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

    <!-- 添加成员对话框 -->
    <el-dialog
      v-model="addDialogVisible"
      title="添加成员"
      width="400px"
    >
      <el-form :model="addForm" label-width="80px">
        <el-form-item label="用户名">
          <el-input 
            v-model="addForm.username" 
            placeholder="请输入要添加的用户名"
            @keyup.enter="submitAddMember"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="addDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitAddMember" :loading="adding">确定</el-button>
      </template>
    </el-dialog>
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
  margin: 0;
  font-size: 18px;
  color: #303133;
}

.members-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>
