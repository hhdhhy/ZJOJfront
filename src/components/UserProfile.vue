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
        <p>昵称: {{ userInfo.nickname || '未设置' }}</p>
        <p>邮箱: {{ userInfo.email || '未设置' }}</p>
        <p>加入时间: {{ userInfo.joinDate || '未知' }}</p>
        <p>签名: {{ userInfo.signature || '暂无签名' }}</p>
      </div>
    </div>
    
    <div class="stats">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-card class="stat-card">
            <div class="stat-number">{{ userInfo.solvedProblems || 0 }}</div>
            <div class="stat-label">已解决问题</div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card class="stat-card">
            <div class="stat-number">{{ userInfo.submissions || 0 }}</div>
            <div class="stat-label">提交次数</div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card class="stat-card">
            <div class="stat-number">{{ userInfo.rating || '-' }}</div>
            <div class="stat-label">评分</div>
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
      username: 'testuser',
      nickname: '测试用户',
      email: 'test@example.com',
      joinDate: '2023-01-01',
      solvedProblems: 15,
      submissions: 32,
      rating: 1500,
      signature: '努力刷题中...'
    })
  }
})

// 使用本地图片，防止外部链接无法访问
const avatarUrl = ref(avatarImg)
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
  font-size: 24px;
  font-weight: bold;
  color: #409EFF;
  margin-bottom: 5px;
}

.stat-label {
  color: #909399;
  font-size: 14px;
}
</style>