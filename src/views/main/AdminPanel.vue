<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import authHttp from '@/api/authHttp'

const loading = ref(false)
const userList = ref([])
const searchKeyword = ref('')
const roleFilter = ref('all') // all, student, coach, admin

// 获取用户列表
const fetchUserList = async () => {
  loading.value = true
  try {
    const res = await authHttp.get('/api/users/', {
      params: {
        search: searchKeyword.value || undefined,
        role: roleFilter.value === 'all' ? undefined : roleFilter.value
      }
    })
    userList.value = res.data.results || []
  } catch (err) {
    ElMessage.error('获取用户列表失败')
    console.error(err)
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  fetchUserList()
}

// 修改密码
const handleChangePassword = async (user) => {
  try {
    const { value: newPassword } = await ElMessageBox.prompt(
      `为用户 "${user.username}" 设置新密码`,
      '修改密码',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputType: 'password',
        inputPlaceholder: '请输入新密码',
        inputValidator: (value) => {
          if (!value) {
            return '密码不能为空'
          }
          if (value.length < 6) {
            return '密码长度至少6位'
          }
          return true
        }
      }
    )
    
    await authHttp.put(`/api/users/${user.id}/change_password/`, {
      new_password: newPassword
    })
    
    ElMessage.success('密码修改成功')
  } catch (err) {
    if (err !== 'cancel') {
      ElMessage.error('修改密码失败')
      console.error(err)
    }
  }
}

// 获取角色标签类型
const getRoleType = (user) => {
  if (user.is_superuser) return 'warning'
  if (user.is_staff) return 'danger'
  return 'info'
}

// 获取角色文本
const getRoleText = (user) => {
  if (user.is_superuser) return '管理员'
  if (user.is_staff) return '教练'
  return '学生'
}

onMounted(() => {
  fetchUserList()
})
</script>

<template>
  <div class="admin-container">
    <div class="page-header">
      <h2>管理员中心</h2>
    </div>

    <!-- 搜索和筛选 -->
    <div class="filter-bar">
      <el-input
        v-model="searchKeyword"
        placeholder="搜索用户名或姓名"
        style="width: 300px; margin-right: 10px"
        @keyup.enter="handleSearch"
      >
        <template #append>
          <el-button @click="handleSearch">搜索</el-button>
        </template>
      </el-input>
      
      <el-select v-model="roleFilter" @change="fetchUserList" style="width: 150px">
        <el-option label="全部" value="all" />
        <el-option label="学生" value="student" />
        <el-option label="教练" value="coach" />
        <el-option label="管理员" value="admin" />
      </el-select>
    </div>

    <!-- 用户列表 -->
    <el-table 
      v-loading="loading" 
      :data="userList" 
      style="width: 100%"
      empty-text="暂无用户数据"
    >
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="username" label="用户名" width="150" />
      <el-table-column prop="realname" label="真实姓名" width="150" />
      <el-table-column prop="email" label="邮箱" min-width="200" />
      <el-table-column prop="telephone" label="电话" width="150" />
      <el-table-column label="角色" width="120">
        <template #default="{ row }">
          <el-tag :type="getRoleType(row)" size="small">
            {{ getRoleText(row) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150" fixed="right">
        <template #default="{ row }">
          <el-button 
            type="primary" 
            size="small"
            @click="handleChangePassword(row)"
          >
            修改密码
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<style scoped>
.admin-container {
  padding: 20px;
}

.page-header {
  margin-bottom: 20px;
}

.page-header h2 {
  margin: 0;
  font-size: 24px;
  color: #303133;
}

.filter-bar {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}
</style>
