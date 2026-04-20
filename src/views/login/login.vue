<script setup name="login">
import {reactive, ref} from "vue"
import { useAuthStore } from "@/stores/auth" 
import { useRouter } from "vue-router"
import authHttp from "@/api/authHttp"
import { ElMessage } from 'element-plus'
import AuthContainer from '@/components/AuthContainer.vue'

const authStore = useAuthStore()
const router = useRouter()
const formRef = ref(null)
const loading = ref(false)

let form_login = reactive({
  username: "",
  password: ""
})

const onSubmit = async () => {
  let usernameRex = /^[0-9a-zA-Z_-]{2,20}$/
  let pwdRgx = /^[0-9a-zA-Z_-]{6,20}$/
  
  if (!usernameRex.test(form_login.username)) {
    ElMessage.warning("用户名格式错误")
    return
  }
  if (!pwdRgx.test(form_login.password)) {
    ElMessage.warning("密码格式错误")
    return
  }
  
  loading.value = true
  try {
    // 使用 authHttp.post 直接调用 API
    const res = await authHttp.post('/api/login/', form_login)
    let data = res.data
    
    let token = data.token
    let user = data.user
  
    authStore.setUserToken(user, token)
    ElMessage.success("登录成功")
    router.push({ name: "frame" })
    
  } catch (err) {
    let errorMsg = "登录失败"
    if (err.response && err.response.data) {
      if (err.response.data.detail) {
        errorMsg += "：" + err.response.data.detail
      } else if (err.response.data.error) {
        errorMsg += "：" + err.response.data.error
      } else {
        errorMsg += "：请检查用户名和密码"
      }
    }
    ElMessage.error(errorMsg)
    console.log("登录失败：", err)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <AuthContainer title="欢迎回来" subtitle="请输入您的账号信息">
    <el-form :model="form_login" ref="formRef" @keyup.enter="onSubmit">
      <el-form-item class="form-item">
        <label class="custom-label">
          <span class="label-icon">👤</span>
          用户名
        </label>
        <el-input 
          type="text" 
          placeholder="请输入用户名" 
          class="input-field" 
          v-model="form_login.username"
          size="small"
        />
      </el-form-item>

      <el-form-item class="form-item">
        <label class="custom-label">
          <span class="label-icon">🔒</span>
          密码
        </label>
        <el-input 
          type="password" 
          placeholder="请输入密码" 
          class="input-field" 
          v-model="form_login.password"
          size="small"
          show-password
        />
      </el-form-item>
    </el-form>

    <el-button 
      class="auth-btn" 
      @click="onSubmit"
      :loading="loading"
      type="primary"
    >
      <span class="btn-text">登 录</span>
      <span class="btn-shine"></span>
    </el-button>

    <div class="extra-links">
      <a href="#" class="link-item">忘记密码？</a>
      <span class="divider">|</span>
      <router-link to="/register" class="link-item">注册新账号</router-link>
    </div>
  </AuthContainer>
</template>

<style scoped>
.form-item {
  margin-bottom: 12px;
  text-align: left;
  position: relative;
}

.form-item :deep(.el-form-item__content) {
  display: block;
}

.custom-label {
  display: flex;
  align-items: center;
  margin-bottom: 4px;
  color: #4a5568;
  font-size: 12px;
  font-weight: 600;
}

.label-icon {
  margin-right: 3px;
  font-size: 10px;
}

.input-field {
  width: 100%;
}

.input-field :deep(.el-input__wrapper) {
  padding: 6px 8px 6px 28px;
  border-radius: 6px;
  box-shadow: 0 0 0 1px #e2e8f0 inset;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 12px;
  background: #fff;
}

.input-field :deep(.el-input__inner) {
  font-size: 12px;
}

.input-field :deep(.el-input__wrapper):hover {
  box-shadow: 0 0 0 1px #667eea inset;
}

.input-field :deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
  transform: translateY(-2px);
}

.auth-btn {
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 10px;
  position: relative;
  overflow: hidden;
  letter-spacing: 1px;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
  height: auto;
}

.auth-btn :deep(.el-button__text) {
  position: relative;
  z-index: 2;
}

.auth-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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

.divider {
  color: #cbd5e0;
  user-select: none;
}
</style>