<template>
  <div class="knowledge-qa-container">
    <el-row :gutter="20">
      <!-- 左侧聊天区域 -->
      <el-col :span="16">
        <el-card class="chat-card">
          <template #header>
            <div class="card-header">
              <span class="card-title">🤖 AI智能问答</span>
              <el-button type="danger" size="small" @click="handleClearHistory" :loading="clearing">
                清空历史
              </el-button>
            </div>
          </template>
          
          <!-- 聊天记录 -->
          <div class="chat-messages" ref="messagesContainer">
            <div v-if="chatHistory.length === 0" class="empty-state">
              <el-empty description="开始你的第一个问题吧!" />
            </div>
            
            <div 
              v-for="(msg, index) in chatHistory" 
              :key="index" 
              class="message-item"
              :class="{ 'user-message': msg.role === 'user', 'ai-message': msg.role === 'ai' }"
            >
              <div class="message-avatar">
                {{ msg.role === 'user' ? '👤' : '🤖' }}
              </div>
              <div class="message-content">
                <div class="message-text" v-html="renderMarkdown(msg.content)"></div>
                <div class="message-time">{{ formatTime(msg.time) }}</div>
                
                <!-- AI回答的来源 -->
                <div v-if="msg.sources && msg.sources.length > 0" class="message-sources">
                  <div class="sources-title">📚 参考来源:</div>
                  <el-tag 
                    v-for="(source, idx) in msg.sources" 
                    :key="idx"
                    size="small"
                    style="margin-right: 5px; margin-bottom: 5px;"
                  >
                    {{ source.metadata?.title || '文档' + (idx + 1) }}
                  </el-tag>
                </div>
              </div>
            </div>
            
            <!-- 加载中 -->
            <div v-if="loading" class="message-item ai-message">
              <div class="message-avatar">🤖</div>
              <div class="message-content">
                <el-skeleton :rows="2" animated />
              </div>
            </div>
          </div>
          
          <!-- 输入框 -->
          <div class="chat-input">
            <el-input
              v-model="question"
              type="textarea"
              :rows="3"
              placeholder="请输入你的问题..."
              :disabled="loading"
              @keydown.ctrl.enter="handleSend"
            />
            <div class="input-actions">
              <el-checkbox v-model="useRag">使用RAG模式</el-checkbox>
              <el-button 
                type="primary" 
                @click="handleSend" 
                :loading="loading"
                :disabled="!question.trim()"
              >
                发送 (Ctrl+Enter)
              </el-button>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <!-- 右侧统计信息 -->
      <el-col :span="8">
        <el-card class="stats-card">
          <template #header>
            <div class="card-header">
              <span class="card-title">📊 使用情况</span>
            </div>
          </template>
          
          <div v-if="usageStats" class="stats-content">
            <div class="stat-item">
              <div class="stat-label">每日配额</div>
              <div class="stat-value">{{ usageStats.daily_quota }}</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">今日已用</div>
              <div class="stat-value">{{ usageStats.used_today }}</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">剩余配额</div>
              <div class="stat-value highlight">{{ usageStats.remaining }}</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">历史记录</div>
              <div class="stat-value">{{ usageStats.history_count }} / {{ usageStats.max_history }}</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">重置时间</div>
              <div class="stat-value small">{{ usageStats.reset_time }}</div>
            </div>
            
            <el-progress 
              :percentage="getUsagePercentage()" 
              :color="getProgressColor()"
              :stroke-width="20"
            />
          </div>
          
          <el-skeleton v-else :rows="5" animated />
        </el-card>
        
        <el-card class="tips-card" style="margin-top: 20px;">
          <template #header>
            <div class="card-header">
              <span class="card-title">💡 使用提示</span>
            </div>
          </template>
          
          <ul class="tips-list">
            <li>RAG模式会检索知识库,适合技术问题</li>
            <li>简单对话模式适合日常交流</li>
            <li>使用 Ctrl+Enter 快速发送</li>
            <li>每日配额会在凌晨重置</li>
          </ul>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { marked } from 'marked'
import { aiChat, getChatHistory, getUsageStats, clearChatHistory } from '@/api'

// 响应式数据
const question = ref('')
const chatHistory = ref([])
const loading = ref(false)
const clearing = ref(false)
const useRag = ref(true)
const usageStats = ref(null)
const messagesContainer = ref(null)

// 渲染Markdown
const renderMarkdown = (content) => {
  if (!content) return ''
  return marked.parse(content)
}

// 格式化时间
const formatTime = (timeString) => {
  if (!timeString) return ''
  const date = new Date(timeString)
  return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
}

// 获取使用统计
const fetchUsageStats = async () => {
  try {
    const res = await getUsageStats()
    usageStats.value = res.data
  } catch (error) {
    console.error('获取使用统计失败:', error)
  }
}

// 获取聊天历史
const fetchChatHistory = async () => {
  try {
    const res = await getChatHistory({ limit: 50 })
    // 转换格式以适应前端展示
    const history = []
    res.data.results.forEach(item => {
      history.push({
        role: 'user',
        content: item.question,
        time: item.created_at
      })
      history.push({
        role: 'ai',
        content: item.answer,
        time: item.created_at,
        sources: item.sources
      })
    })
    chatHistory.value = history
    scrollToBottom()
  } catch (error) {
    console.error('获取聊天历史失败:', error)
  }
}

// 发送消息
const handleSend = async () => {
  if (!question.value.trim() || loading.value) return
  
  const userQuestion = question.value.trim()
  
  // 添加用户消息
  chatHistory.value.push({
    role: 'user',
    content: userQuestion,
    time: new Date().toISOString()
  })
  
  question.value = ''
  loading.value = true
  scrollToBottom()
  
  try {
    const res = await aiChat({
      question: userQuestion,
      use_rag: useRag.value,
      top_k: 3
    })
    
    // 添加AI回复
    chatHistory.value.push({
      role: 'ai',
      content: res.data.answer,
      time: new Date().toISOString(),
      sources: res.data.sources
    })
    
    // 更新使用统计
    await fetchUsageStats()
    scrollToBottom()
  } catch (error) {
    ElMessage.error(error.response?.data?.detail || 'AI回答失败')
    console.error(error)
  } finally {
    loading.value = false
  }
}

// 清空历史
const handleClearHistory = async () => {
  try {
    await ElMessageBox.confirm(
      '确定要清空所有对话历史吗?此操作不可恢复!',
      '警告',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    clearing.value = true
    await clearChatHistory()
    ElMessage.success('已清空对话历史')
    chatHistory.value = []
    await fetchUsageStats()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('清空失败')
      console.error(error)
    }
  } finally {
    clearing.value = false
  }
}

// 滚动到底部
const scrollToBottom = async () => {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

// 计算使用百分比
const getUsagePercentage = () => {
  if (!usageStats.value || !usageStats.value.daily_quota) return 0
  return Math.round((usageStats.value.used_today / usageStats.value.daily_quota) * 100)
}

// 获取进度条颜色
const getProgressColor = () => {
  const percentage = getUsagePercentage()
  if (percentage < 60) return '#67c23a'
  if (percentage < 80) return '#e6a23c'
  return '#f56c6c'
}

// 初始化
onMounted(() => {
  fetchUsageStats()
  fetchChatHistory()
})
</script>

<style scoped>
.knowledge-qa-container {
  padding: 0;
  height: 100%;
}

.chat-card, .stats-card, .tips-card {
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  border: none;
  overflow: hidden;
  transition: all 0.3s ease;
}

.chat-card:hover, .stats-card:hover, .tips-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

.chat-card :deep(.el-card__header),
.stats-card :deep(.el-card__header),
.tips-card :deep(.el-card__header) {
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  padding: 18px 24px;
  border-bottom: none;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.chat-messages {
  height: 500px;
  overflow-y: auto;
  padding: 20px;
  background: linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%);
  scroll-behavior: smooth;
}

.chat-messages::-webkit-scrollbar {
  width: 8px;
}

.chat-messages::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.chat-messages::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
  border-radius: 4px;
}

.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  text-align: center;
}

.message-item {
  display: flex;
  margin-bottom: 20px;
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.message-avatar {
  width: 44px;
  height: 44px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  margin-right: 12px;
  flex-shrink: 0;
  font-size: 24px;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

.user-message .message-avatar {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  box-shadow: 0 2px 8px rgba(245, 87, 108, 0.3);
}

.message-content {
  flex: 1;
  max-width: calc(100% - 56px);
}

.message-text {
  background: white;
  padding: 14px 18px;
  border-radius: 12px;
  margin-bottom: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  line-height: 1.6;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.user-message .message-text {
  background: linear-gradient(135deg, rgba(240, 147, 251, 0.1) 0%, rgba(245, 87, 108, 0.1) 100%);
  border-left: 3px solid #f5576c;
}

.ai-message .message-text {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(118, 75, 162, 0.08) 100%);
  border-left: 3px solid #667eea;
}

.message-time {
  font-size: 12px;
  color: #909399;
  margin-bottom: 8px;
  padding-left: 4px;
}

.message-sources {
  margin-top: 12px;
  padding: 12px;
  background: white;
  border-radius: 8px;
  border: 1px solid rgba(102, 126, 234, 0.2);
}

.sources-title {
  font-size: 13px;
  color: #606266;
  margin-bottom: 8px;
  font-weight: 500;
}

.chat-input {
  margin-top: 15px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
}

.chat-input :deep(.el-textarea__inner) {
  border-radius: 8px;
  border: 2px solid #e0e0e0;
  transition: all 0.3s ease;
}

.chat-input :deep(.el-textarea__inner:focus) {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.input-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
}

.input-actions :deep(.el-button--primary) {
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  border: none;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
  transition: all 0.3s ease;
}

.input-actions :deep(.el-button--primary:hover) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.stat-item {
  margin-bottom: 18px;
  padding: 12px;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
  border-radius: 8px;
  border-left: 3px solid #667eea;
}

.stat-label {
  font-size: 13px;
  color: #6c757d;
  margin-bottom: 6px;
  font-weight: 500;
}

.stat-value {
  font-size: 20px;
  font-weight: 700;
  color: #303133;
}

.stat-value.highlight {
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stat-value.small {
  font-size: 14px;
  font-weight: 500;
}

.tips-list {
  padding-left: 20px;
  margin: 0;
}

.tips-list li {
  margin-bottom: 10px;
  font-size: 14px;
  color: #606266;
  line-height: 1.6;
  position: relative;
}

.tips-list li::marker {
  color: #667eea;
}

/* Markdown样式 */
:deep(.message-text) {
  line-height: 1.8;
}

:deep(.message-text h1),
:deep(.message-text h2),
:deep(.message-text h3),
:deep(.message-text h4),
:deep(.message-text h5),
:deep(.message-text h6) {
  margin: 16px 0 10px 0;
  color: #2c3e50;
  font-weight: 600;
}

:deep(.message-text p) {
  margin: 10px 0;
}

:deep(.message-text pre) {
  background: linear-gradient(135deg, #2d2d2d 0%, #1e1e1e 100%);
  color: #f8f8f2;
  padding: 16px;
  border-radius: 8px;
  overflow-x: auto;
  margin: 12px 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

:deep(.message-text code) {
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  background: rgba(102, 126, 234, 0.1);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 13px;
  color: #667eea;
}

:deep(.message-text pre code) {
  background: transparent;
  padding: 0;
  color: inherit;
}

:deep(.message-text ul),
:deep(.message-text ol) {
  padding-left: 24px;
  margin: 12px 0;
}

:deep(.message-text li) {
  margin-bottom: 6px;
}

:deep(.message-text table) {
  width: 100%;
  border-collapse: collapse;
  margin: 12px 0;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

:deep(.message-text th),
:deep(.message-text td) {
  border: 1px solid #e0e0e0;
  padding: 10px 12px;
}

:deep(.message-text th) {
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-weight: 600;
}

:deep(.message-text tr:nth-child(even)) {
  background: #f8f9fa;
}
</style>