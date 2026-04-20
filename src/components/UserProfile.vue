<template>
  <el-card class="profile-card" :shadow="'never'">
    <template #header>
      <div class="card-header">
        <span class="card-title">个人资料</span>
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
    
    <!-- 密码修改区域 -->
    <el-divider />
    <div class="password-section">
      <h3>🔒 修改密码</h3>
      <el-form 
        ref="passwordFormRef"
        :model="passwordForm"
        :rules="passwordRules"
        label-position="left"
        label-width="100px"
        class="password-form"
      >
        <el-form-item label="原密码" prop="old_password">
          <el-input 
            v-model="passwordForm.old_password" 
            type="password"
            placeholder="请输入原密码"
            show-password
            clearable
          />
        </el-form-item>
        
        <el-form-item label="新密码" prop="new_password">
          <el-input 
            v-model="passwordForm.new_password" 
            type="password"
            placeholder="请输入新密码（6-20字符）"
            show-password
            clearable
          />
        </el-form-item>
        
        <el-form-item label="确认密码" prop="confirm_password">
          <el-input 
            v-model="passwordForm.confirm_password" 
            type="password"
            placeholder="请再次输入新密码"
            show-password
            clearable
          />
        </el-form-item>
        
        <el-form-item>
          <el-button 
            type="primary" 
            @click="handleChangePassword" 
            :loading="changingPassword"
          >
            修改密码
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-card>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { ElMessage, ElForm } from 'element-plus'
import { updateUserProfile, changePassword, getUserProfile } from '@/api'

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

// 密码修改相关
const passwordFormRef = ref(null)
const changingPassword = ref(false)
const passwordForm = ref({
  old_password: '',
  new_password: '',
  confirm_password: ''
})

// 验证确认密码
const validateConfirmPassword = (rule, value, callback) => {
  if (value !== passwordForm.value.new_password) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

// 密码表单验证规则
const passwordRules = {
  old_password: [
    { required: true, message: '请输入原密码', trigger: 'blur' }
  ],
  new_password: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度必须在6-20字符之间', trigger: 'blur' }
  ],
  confirm_password: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    { validator: validateConfirmPassword, trigger: 'blur' }
  ]
}

// 获取用户资料
const fetchProfile = async () => {
  try {
    const res = await getUserProfile()
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
    const res = await updateUserProfile({
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

// 修改密码
const handleChangePassword = async () => {
  if (!passwordFormRef.value) return
  
  await passwordFormRef.value.validate(async (valid) => {
    if (valid) {
      changingPassword.value = true
      try {
        const res = await changePassword({
          old_password: passwordForm.value.old_password,
          new_password: passwordForm.value.new_password
        })
        
        if (res.data.code === 200) {
          ElMessage.success('密码修改成功')
          // 清空表单
          passwordForm.value = {
            old_password: '',
            new_password: '',
            confirm_password: ''
          }
        } else {
          ElMessage.error(res.data.message || '密码修改失败')
        }
      } catch (error) {
        ElMessage.error(error.response?.data?.message || '密码修改失败')
        console.error(error)
      } finally {
        changingPassword.value = false
      }
    }
  })
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

.password-section {
  margin-top: 20px;
}

.password-section h3 {
  margin-bottom: 20px;
  color: #303133;
  font-size: 16px;
}

.password-form {
  max-width: 500px;
}

:deep(.el-skeleton__item) {
  height: 40px !important;
  margin-bottom: 16px;
}
</style>