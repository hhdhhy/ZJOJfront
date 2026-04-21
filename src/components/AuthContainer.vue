<script setup>
import img_zjoj from "@/assets/img/zjoj.png"

defineProps({
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    default: ""
  }
})
</script>

<template>
  <div class="auth-container">
    <div class="site-header">
      <h1 class="site-title">铸剑OJ</h1>
    </div>
    <div class="auth-box">
      <div class="auth-header">
        <img :src="img_zjoj" alt="铸剑OJ Logo" class="logo-icon-img" />
        <h2 class="auth-title">{{ title }}</h2>
        <p v-if="subtitle" class="auth-subtitle">{{ subtitle }}</p>
      </div>

      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #f5f7fa;
  font-family: 'Segoe UI', 'Microsoft YaHei', sans-serif;
  padding: 20px;
  position: relative;
  overflow: hidden;
}

.site-header {
  position: absolute;
  top: 30px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
}

.site-title {
  margin: 0;
  color: #2d3748;
  font-size: 32px;
  font-weight: 700;
  letter-spacing: 2px;
}

.auth-box {
  background: white;
  padding: 40px;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  width: 100%;
  max-width: 420px;
  text-align: center;
  position: relative;
  z-index: 10;
}

.auth-header {
  margin-bottom: 35px;
}

.logo-icon-img {
  width: 100px;
  height: 100px;
  max-width: 100%;
  object-fit: contain;
  margin-bottom: 15px;
  display: inline-block;
  background: transparent !important;
  border: none;
  border-radius: 0;
  padding: 0;
}

.auth-title {
  margin: 0 0 8px;
  color: #2d3748;
  font-size: 28px;
  font-weight: 700;
  letter-spacing: -0.5px;
}

.auth-subtitle {
  margin: 0;
  color: #718096;
  font-size: 14px;
  font-weight: 400;
}
</style>