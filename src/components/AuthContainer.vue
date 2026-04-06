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
    <!-- CSS 岩浆效果容器 -->
    <div class="lava-container">
      <div class="lava"></div>
      <div class="lava-flow"></div>
      <div class="lava-glow"></div>
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
  background: linear-gradient(-45deg, #4B0082, #8A2BE2, #3c37d5, #9370DB, #6A5ACD);
  background-size: 600% 600%;
  animation: gradientBG 12s ease infinite;
  font-family: 'Segoe UI', 'Microsoft YaHei', sans-serif;
  padding: 20px;
  position: relative;
  overflow: hidden;
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

.auth-box {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 50px 40px;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.2) inset;
  width: 100%;
  max-width: 420px;
  text-align: center;
  transform: translateY(0);
  transition: transform 0.3s ease;
  position: relative;
  z-index: 10;
}

.auth-box:hover {
  transform: translateY(-5px);
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

/* 复用登录页面的岩浆效果样式 */
.lava-container {
  position: absolute;
  bottom: 0;
  left: -100px;
  width: calc(100% + 200px);
  height: 150px;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  pointer-events: none;
  z-index: 5;
  overflow: visible;
}

.lava {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 100px;
  background: linear-gradient(to top, #FF4500, #FF6347, #FFA500);
  border-radius: 50% 50% 0 0;
  filter: drop-shadow(0 0 15px rgba(255, 69, 0, 0.8));
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
      rgba(255, 69, 0, 0.7),
      transparent);
  border-radius: 50%;
  filter: blur(10px);
  animation: flow 4s infinite linear;
  opacity: 0.8;
}

@keyframes lavaFlow {
  0%, 100% {
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
  left: -200px;
  width: calc(100% + 400px);
  height: 150px;
  background: radial-gradient(ellipse at center, rgba(255, 100, 0, 0.4) 0%, rgba(255, 165, 0, 0.2) 70%, transparent 70%);
  filter: blur(40px);
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