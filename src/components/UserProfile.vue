<template>
  <el-card class="info-card">
    <template #header>
      <div class="card-header">
        <span>个人信息</span>
      </div>
    </template>
    
    <div class="user-profile">
      <el-avatar :size="100" :src="avatarUrl" class="profile-avatar" />
      <div class="user-details">
        <h3>{{ userInfo.username }}</h3>
        <p>真实姓名: {{ userInfo.realname || '未设置' }}</p>
        <p>邮箱: {{ userInfo.email || '未设置' }}</p>
        <p>电话: {{ userInfo.telephone || '未设置' }}</p>
        <p>加入时间: {{ formatDate(userInfo.date_joined) || '未知' }}</p>
      </div>
    </div>
    
    <div class="stats">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-card class="stat-card">
            <div class="stat-number">{{ userInfo.uid}}</div>
            <div class="stat-label">用户ID</div>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card class="stat-card">
            <div class="stat-number">{{ userInfo.is_superuser ? '管理员' : '普通用户' }}</div>
            <div class="stat-label">用户类型</div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </el-card>
</template>

<script setup>
import { ref } from 'vue'
import avatarImg from '@/assets/img/zjoj.png'

defineProps({
  userInfo: {
    type: Object,
    default: () => ({
      username: '',
      realname: '',
      email: '',
      date_joined: '',
      last_login: '',
      status: 0,
      telephone: '',
      uid: '',
      is_superuser: false,
      is_active: true,
      is_staff: false
    })
  }
})

// 使用本地图片，防止外部链接无法访问
const avatarUrl = ref(avatarImg)

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return ''
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

</script>

<style scoped>
.info-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.user-profile {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.profile-avatar {
  margin-right: 30px;
}

.user-details p {
  margin: 8px 0;
  color: #606266;
}

.stats {
  margin-top: 20px;
}

.stat-card {
  text-align: center;
  padding: 15px;
}

.stat-number {
  font-size: 16px;
  font-weight: bold;
  color: #409EFF;
  margin-bottom: 5px;
  word-break: break-all;
}

.stat-label {
  color: #909399;
  font-size: 14px;
}
</style>