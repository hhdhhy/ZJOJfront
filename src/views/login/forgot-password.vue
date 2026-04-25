<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import authHttp from '@/api/authHttp'
import { ElMessage } from 'element-plus'
import AuthContainer from '@/components/AuthContainer.vue'

const router = useRouter()
const formRef = ref(null)
const loading = ref(false)

let form_reset = reactive({
  email: ''
})

const onSubmit = async () => {
  let emailRex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  
  if (!emailRex.test(form_reset.email)) {
    ElMessage.warning('请输入有效的邮箱地址')
    return
  }
  
  loading.value = true
  try {
    await authHttp.post('/api/password/reset/', {
      email: form_reset.email
    })
    
    ElMessage.success('重置密码链接已发送到您的邮箱')
    // 3秒后跳转到登录页
    setTimeout(() => {
      router.push({ name: 'login' })
    }, 3000)
    
  } catch (err) {
    let errorMsg = '发送失败'
    if (err.response && err.response.data) {
      const data = err.response.data
      if (data.detail) {
        errorMsg += ':' + data.detail
      } else if (data.error) {
        errorMsg += ':' + data.error
      } else if (data.message) {
        errorMsg += ':' + data.message
      } else {
        errorMsg += ':请检查邮箱地址'
      }
    } else if (err.code === 'ECONNABORTED') {
      errorMsg += ':请求超时,请检查网络连接'
    } else {
      errorMsg += ':网络错误,请稍后重试'
    }
    ElMessage.error(errorMsg)
    console.log('重置密码失败:', err)
  } finally {
    loading.value = false
  }
}

const goBackToLogin = () => {
  router.push({ name: 'login' })
}
</script>

<template>
  <AuthContainer title="重置密码" subtitle="输入注册邮箱获取重置链接">
    <el-form :model="form_reset" ref="formRef" @keyup.enter="onSubmit">
      <el-form-item class="form-item">
        <label class="custom-label">
          邮箱
        </label>
        <el-input 
          type="email" 
          placeholder="请输入注册邮箱" 
          class="input-field" 
          v-model="form_reset.email"
          size="small"
        />
      </el-form-item>
    </el-form>

    <el-button 
      class="auth-btn" 
      @click="onSubmit"
      :loading="loading"
      type="primary"
    >
      <span class="btn-text">发送重置链接</span>
      <span class="btn-shine"></span>
    </el-button>

    <div class="extra-links">
      <a href="#" class="link-item" @click.prevent="goBackToLogin">返回登录</a>
    </div>
  </AuthContainer>
</template>

<style scoped>
.form-item {
  margin-bottom: 12px;
  text-align: left;
  position: relative;
}

.custom-label {
  display: flex;
  align-items: center;
  margin-bottom: 4px;
  color: #4a5568;
  font-size: 12px;
  font-weight: 600;
}

.input-field {
  width: 100%;
}

.input-field :deep(.el-input__wrapper) {
  padding: 6px 8px 6px 28px;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  transition: all 0.3s;
  font-size: 12px;
  background: #fff;
}

.input-field :deep(.el-input__inner) {
  font-size: 12px;
}

.input-field :deep(.el-input__wrapper):hover {
  border-color: #c0c4cc;
}

.input-field :deep(.el-input__wrapper.is-focus) {
  border-color: #409eff;
}

.auth-btn {
  width: 100%;
  padding: 12px;
  background-color: #409eff;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  margin-top: 10px;
  height: auto;
}

.auth-btn :deep(.el-button__text) {
  color: white;
}

.auth-btn:hover {
  background-color: #66b1ff;
}

.auth-btn:active {
  transform: translateY(1px);
}

.btn-shine {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s;
  z-index: 1;
  pointer-events: none;
}

.auth-btn:hover .btn-shine {
  left: 100%;
}

.extra-links {
  margin-top: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  font-size: 14px;
}

.link-item {
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
  position: relative;
  transition: color 0.3s;
}

.link-item::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 1px;
  background: currentColor;
  transition: width 0.3s ease;
}

.link-item:hover {
  color: #764ba2;
}

.link-item:hover::after {
  width: 100%;
}
</style>
