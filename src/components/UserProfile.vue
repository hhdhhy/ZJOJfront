<template>
  <el-card class="profile-card" shadow="hover">
    <template #header>
      <div class="card-header">
        <span class="card-title">👤 个人资料</span>
        <el-button 
          type="primary" 
          size="small"
          @click="updateProfile" 
          :loading="updating"
          :disabled="!hasChanges"
        >
          保存更改
        </el-button>
      </div>
    </template>
    
    <el-skeleton v-if="loading" :rows="4" animated />
    
    <el-form 
      v-else 
      ref="profileFormRef"
      :model="profileForm"
      label-position="left"
      label-width="80px"
      class="profile-form"
    >
      <el-form-item label="用户名" prop="username">
        <el-input 
          v-model="profileForm.username" 
          disabled 
          readonly
        />
      </el-form-item>
      
      <el-form-item label="邮箱" prop="email">
        <el-input 
          v-model="profileForm.email" 
          disabled 
          readonly
        />
      </el-form-item>
      
      <el-form-item 
        label="真实姓名" 
        prop="realname"
        :rules="[{ required: true, message: '请输入真实姓名', trigger: 'blur' }]"
      >
        <el-input 
          v-model="profileForm.realname" 
          placeholder="请输入您的真实姓名"
          clearable
        />
      </el-form-item>
      
      <el-form-item 
        label="电话" 
        prop="telephone"
        :rules="[
          { required: false },
          { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号格式', trigger: 'blur' }
        ]"
      >
        <el-input 
          v-model="profileForm.telephone" 
          placeholder="请输入手机号码"
          clearable
        />
      </el-form-item>
    </el-form>
    
    <div class="last-login-info" v-if="!loading">
      <el-divider />
      <el-text type="info" size="small">
        📅 最后登录时间: {{ formatDate(profileForm.last_login) }}
      </el-text>
    </div>
  </el-card>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { ElMessage, ElForm } from 'element-plus'
import authHttp from '@/api/authHttp'

const props = defineProps({
  userInfo: {
    type: Object,
    default: () => ({})
  }
})

const profileForm = ref({
  username: '',
  email: '',
  realname: '',
  telephone: '',
  last_login: ''
})
const loading = ref(true)
const updating = ref(false)
const originalData = ref({})

// 获取用户资料
const fetchProfile = async () => {
  try {
    const res = await authHttp.get('/api/user/profile/')
    if (res.data.code === 200) {
      profileForm.value = res.data.data
      // 保存原始数据用于比较变化
      originalData.value = { ...res.data.data }
    } else {
      ElMessage.error(res.data.message || '获取用户资料失败')
    }
  } catch (error) {
    ElMessage.error('获取用户资料失败')
    console.error(error)
  } finally {
    loading.value = false
  }
}

// 检查是否有更改
const hasChanges = computed(() => {
  return profileForm.value.realname !== originalData.value.realname ||
         profileForm.value.telephone !== originalData.value.telephone
})

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return '暂无记录'
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

// 更新用户资料
const updateProfile = async () => {
  updating.value = true
  try {
    const res = await authHttp.put('/api/user/profile/', {
      realname: profileForm.value.realname,
      telephone: profileForm.value.telephone
    })
    if (res.data.code === 200) {
      ElMessage.success('资料更新成功')
      // 更新成功后刷新原始数据
      originalData.value = { ...profileForm.value }
    } else {
      ElMessage.error(res.data.message || '资料更新失败')
    }
  } catch (error) {
    ElMessage.error('资料更新失败')
    console.error(error)
  } finally {
    updating.value = false
  }
}

onMounted(() => {
  fetchProfile()
})
</script>

<style scoped>
.profile-card {
  max-width: 600px;
  margin: 20px auto;
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

.profile-form {
  margin-top: 20px;
}

.profile-form :deep(.el-form-item__label) {
  font-weight: 500;
  color: #606266;
}

.last-login-info {
  margin-top: 20px;
}

:deep(.el-skeleton__item) {
  height: 40px !important;
  margin-bottom: 16px;
}
</style>