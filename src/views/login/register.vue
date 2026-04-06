<script setup>
import { reactive, ref } from "vue"
import { useRouter } from "vue-router"
import authHttp from "@/api/authHttp"
import { ElMessage } from 'element-plus'
import { useAuthStore } from "@/stores/auth"
import AuthContainer from '@/components/AuthContainer.vue'

const router = useRouter()
const authStore = useAuthStore()
const formRef = ref(null)
const loading = ref(false)

let form_register = reactive({
  username: "",
  password: "",
  confirmPassword: ""
})

const onSubmit = async () => {
  let usernameRex = /^[0-9a-zA-Z_-]{2,20}$/
  let pwdRgx = /^[0-9a-zA-Z_-]{6,20}$/
  
  if (!usernameRex.test(form_register.username)) {
    ElMessage.warning("用户名格式错误：2-20位字母、数字、下划线或横线")
    return
  }
  if (!pwdRgx.test(form_register.password)) {
    ElMessage.warning("密码格式错误：6-20位字母、数字、下划线或横线")
    return
  }
  if (form_register.password !== form_register.confirmPassword) {
    ElMessage.warning("两次输入的密码不一致")
    return
  }
  
  loading.value = true
  try {
    const res = await authHttp.register(form_register.username, form_register.password)
    let data = res.data
    
    ElMessage.success("注册成功！请登录")
    // 注册成功后跳转到登录页面
    router.push({ name: "login" })
    
  } catch (err) {
    let errorMsg = "注册失败"
    if (err.response && err.response.data) {
      if (err.response.data.detail) {
        errorMsg += "：" + err.response.data.detail
      } else if (err.response.data.error) {
        errorMsg += "：" + err.response.data.error
      } else {
        errorMsg += "：请检查输入信息"
      }
    }
    ElMessage.error(errorMsg)
    console.log("注册失败：", err)
  } finally {
    loading.value = false
  }
}

const goBackToLogin = () => {
  router.push({ name: "login" })
}
</script>

<template>
  <AuthContainer title="创建新账号" subtitle="填写以下信息完成注册">
    <el-form :model="form_register" ref="formRef" @keyup.enter="onSubmit">
      <el-form-item class="form-item">
        <label class="custom-label">
          <span class="label-icon">👤</span>
          用户名
        </label>
        <el-input 
          type="text" 
          placeholder="请输入用户名（2-20位）" 
          class="input-field" 
          v-model="form_register.username"
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
          placeholder="请输入密码（6-20位）" 
          class="input-field" 
          v-model="form_register.password"
          size="small"
          show-password
        />
      </el-form-item>

      <el-form-item class="form-item">
        <label class="custom-label">
          <span class="label-icon">✅</span>
          确认密码
        </label>
        <el-input 
          type="password" 
          placeholder="请再次输入密码" 
          class="input-field" 
          v-model="form_register.confirmPassword"
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
      <span class="btn-text">注 册</span>
      <span class="btn-shine"></span>
    </el-button>

    <div class="extra-links">
      <a href="#" class="link-item" @click.prevent="goBackToLogin">已有账号？立即登录</a>
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

.register-btn:hover .btn-shine {
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