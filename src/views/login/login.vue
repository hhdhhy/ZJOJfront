<script setup name="login">
import img_zjoj from "@/assets/img/zjoj.png"
import { reactive, ref } from "vue"
import { useRouter } from "vue-router"
import { ElMessage } from "element-plus"
import { useAuthrStore } from "@/stores/auth" 
import authHttp from "@/api/authHttp"

const authStore = useAuthrStore()
const router = useRouter()
const formRef = ref(null)
const loading = ref(false)

let form_login = reactive({
  username: "",
  password: ""
})

const onSubmit = async () => {
  let usernameRex = /^[0-9a-zA-Z_-]{2,20}$/
  let pwdRgx = /^[0-9a-zA-Z_-]{2,20}$/
  
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
    const res = await authHttp.login(form_login.username, form_login.password)
    let data = res.data
    let token = data.token
    let user = data.user
    authStore.setUserToken(user, token)
    ElMessage.success("登录成功")
    router.push({ name: "frame" })
  } catch (err) {
    ElMessage.error("登录失败：" + err.message)
    console.log(err)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login-container">
    <!-- 新增：CSS 岩浆效果容器移至背景层 -->
    <div class="lava-container">
      <div class="lava"></div>
      <div class="lava-flow"></div>
      <div class="lava-glow"></div>
    </div>

    <div class="login-box">
      <div class="login-header">
        <img :src="img_zjoj" alt="铸剑OJ Logo" class="logo-icon-img" />
        <h2 class="login-title">欢迎回来</h2>
        <p class="login-subtitle">请输入您的账号信息</p>
      </div>

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
            size="large"
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
            size="large"
            show-password
          />
        </el-form-item>
      </el-form>

      <el-button 
        class="login-btn" 
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
        <a href="#" class="link-item">注册新账号</a>
      </div>

    </div>
  </div>
</template>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(-45deg, #4B0082, #8A2BE2, #3c37d5, #9370DB, #6A5ACD);
  /* 更明显的蓝紫色渐变背景 */
  background-size: 600% 600%;
  /* 增加背景尺寸，使渐变更明显 */
  animation: gradientBG 12s ease infinite;
  /* 调整动画时间 */
  font-family: 'Segoe UI', 'Microsoft YaHei', sans-serif;
  padding: 20px;
  position: relative;
  /* 确保子元素绝对定位参考 */
  overflow: hidden;
  /* 防止火焰溢出视口 */
}

@keyframes gradientBG {
  0% {
    background-position: 0% 50%;
  }

  50% {
    background-position: 100% 50%;
  }

  100% {
    background-position: 0% 50%;
  }
}

.login-box {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 50px 40px;
  /* 恢复默认内边距 */
  border-radius: 20px;
  /* 恢复底部圆角 */
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.2) inset;
  width: 100%;
  max-width: 420px;
  text-align: center;
  transform: translateY(0);
  transition: transform 0.3s ease;
  position: relative;
  z-index: 10;
  /* 确保登录框在火焰之上 */
}

.login-box:hover {
  transform: translateY(-5px);
}

.login-header {
  margin-bottom: 35px;
}

.logo-icon-img {
  width: 100px;
  /* 图片宽度 */
  height: 100px;
  /* 图片高度 */
  max-width: 100%;
  /* 确保响应式 */
  object-fit: contain;
  /* 保持图片比例，完整显示 */
  margin-bottom: 15px;
  display: inline-block;
  background: transparent !important;
  /* 背景透明 */
  border: none;
  /* 确保没有边框 */
  border-radius: 0;
  /* 移除圆角，保持原始形状 */
  padding: 0;
  /* 确保没有内边距 */
}

@keyframes float {

  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-10px);
  }
}

.login-title {
  margin: 0 0 8px;
  color: #2d3748;
  font-size: 28px;
  font-weight: 700;
  letter-spacing: -0.5px;
}

.login-subtitle {
  margin: 0;
  color: #718096;
  font-size: 14px;
  font-weight: 400;
}

.form-item {
  margin-bottom: 24px;
  text-align: left;
  position: relative;
}

.form-item {
  margin-bottom: 24px;
  text-align: left;
  position: relative;
}

.form-item :deep(.el-form-item__content) {
  display: block;
}

.custom-label {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  color: #4a5568;
  font-size: 14px;
  font-weight: 600;
}

.label-icon {
  margin-right: 8px;
  font-size: 16px;
}

.input-field {
  width: 100%;
}

.input-field :deep(.el-input__wrapper) {
  padding: 14px 16px 14px 40px;
  border-radius: 12px;
  box-shadow: 0 0 0 1px #e2e8f0 inset;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 15px;
  background: #fff;
}

.input-field :deep(.el-input__inner) {
  font-size: 15px;
}

.input-field :deep(.el-input__wrapper):hover {
  box-shadow: 0 0 0 1px #667eea inset;
}

.input-field :deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
  transform: translateY(-2px);
}

.input-field :deep(.el-input__prefix) {
  left: 12px;
  font-size: 16px;
}

.login-btn {
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

.login-btn :deep(.el-button__text) {
  position: relative;
  z-index: 2;
}

.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-btn:active {
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

.login-btn:hover .btn-shine {
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

.Divider {
  color: #cbd5e0;
  user-select: none;
}

/* 岩浆效果样式 */
.lava-container {
  position: absolute;
  bottom: 0;
  left: -100px;
  /* 扩展容器左边 */
  width: calc(100% + 200px);
  /* 扩展容器总宽度 */
  height: 150px;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  pointer-events: none;
  z-index: 5;
  /* 位于背景渐变之上，登录框之下 */
  overflow: visible;
  /* 确保发光效果不会被截断 */
}

.lava {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 100px;
  background: linear-gradient(to top, #FF4500, #FF6347, #FFA500);
  /* 橙红色渐变 */
  border-radius: 50% 50% 0 0;
  filter: drop-shadow(0 0 15px rgba(255, 69, 0, 0.8));
  /* 橙红色阴影 */
  animation: lavaFlow 5s infinite ease-in-out;
}

.lava-flow {
  position: absolute;
  bottom: 30px;
  width: 100%;
  height: 80px;
  background: linear-gradient(90deg,
      transparent,
      rgba(255, 165, 0, 0.8),
      /* 橙色 */
      rgba(255, 69, 0, 0.7),
      /* 橙红色 */
      transparent);
  border-radius: 50%;
  filter: blur(10px);
  animation: flow 4s infinite linear;
  opacity: 0.8;
}

@keyframes lavaFlow {

  0%,
  100% {
    transform: scaleY(1) scaleX(1);
    opacity: 0.9;
  }

  25% {
    transform: scaleY(1.05) scaleX(0.98) skew(2deg);
  }

  50% {
    transform: scaleY(1.03) scaleX(1.01) skew(-2deg);
  }

  75% {
    transform: scaleY(1.04) scaleX(0.99) skew(1deg);
  }
}

@keyframes flow {
  0% {
    transform: translateX(-100%);
  }

  100% {
    transform: translateX(100%);
  }
}

.lava-glow {
  position: absolute;
  bottom: -60px;
  /* 进一步下移，确保完全显示 */
  left: -200px;
  /* 扩大左边距 */
  width: calc(100% + 400px);
  /* 大幅增加宽度 */
  height: 150px;
  /* 增加高度 */
  background: radial-gradient(ellipse at center, rgba(255, 100, 0, 0.4) 0%, rgba(255, 165, 0, 0.2) 70%, transparent 70%);
  /* 橙红色发光 */
  filter: blur(40px);
  /* 增加模糊半径 */
  animation: glowPulse 2s infinite alternate;
  z-index: 4;
}

@keyframes glowPulse {
  0% {
    opacity: 0.6;
    transform: scaleY(0.8);
  }

  100% {
    opacity: 0.9;
    transform: scaleY(1.1);
  }
}
</style>