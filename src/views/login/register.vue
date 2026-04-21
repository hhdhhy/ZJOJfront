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
  confirmPassword: "",
  email: "",
  realname: "",
  telephone: ""
})

const onSubmit = async () => {
  let usernameRex = /^[0-9a-zA-Z_-]{2,20}$/
  let pwdRgx = /^[0-9a-zA-Z_-]{6,20}$/
  let emailRex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  
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
  if (!emailRex.test(form_register.email)) {
    ElMessage.warning("请输入有效的邮箱地址")
    return
  }
  if (!form_register.realname.trim()) {
    ElMessage.warning("请输入真实姓名")
    return
  }
  
  loading.value = true
  try {
    // 使用 authHttp.post 直接调用 API
    const res = await authHttp.post('/api/register/', {
      username: form_register.username,
      password: form_register.password,
      email: form_register.email,
      realname: form_register.realname,
      telephone: form_register.telephone || null
    })
    let data = res.data
    
    ElMessage.success("注册成功！请登录")
    // 注册成功后跳转到登录页面
    router.push({ name: "login" })
    
  } catch (err) {
    let errorMsg = "注册失败"
    if (err.response && err.response.data) {
      // 尝试获取详细错误信息
      const data = err.response.data
      if (data.detail) {
        errorMsg += "：" + data.detail
      } else if (data.error) {
        errorMsg += "：" + data.error
      } else if (data.message) {
        errorMsg += "：" + data.message
      } else if (typeof data === 'object') {
        // 处理字段验证错误
        const errors = []
        for (const key in data) {
          if (Array.isArray(data[key])) {
            errors.push(`${key}: ${data[key].join(', ')}`)
          }
        }
        if (errors.length > 0) {
          errorMsg += "：\n" + errors.join('\n')
        } else {
          errorMsg += "：请检查输入信息"
        }
      } else {
        errorMsg += "：请检查输入信息"
      }
    } else if (err.code === 'ECONNABORTED') {
      errorMsg += "：请求超时，请检查网络连接"
    } else {
      errorMsg += "：网络错误，请稍后重试"
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
          <span class="label-icon"></span>
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

      <el-form-item class="form-item">
        <label class="custom-label">
          <span class="label-icon">📧</span>
          邮箱
        </label>
        <el-input 
          type="email" 
          placeholder="请输入邮箱地址" 
          class="input-field" 
          v-model="form_register.email"
          size="small"
        />
      </el-form-item>

      <el-form-item class="form-item">
        <label class="custom-label">
          <span class="label-icon">📛</span>
          真实姓名
        </label>
        <el-input 
          type="text" 
          placeholder="请输入您的真实姓名" 
          class="input-field" 
          v-model="form_register.realname"
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