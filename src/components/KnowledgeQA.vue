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
  padding: 20px;
  height: 100%;
}

.chat-card {
  height: 100%;
}

.stats-card, .tips-card {
  height: auto;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.chat-messages {
  height: 400px;
  overflow-y: auto;
  padding: 10px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  margin-bottom: 15px;
  background-color: #fafafa;
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
  margin-bottom: 15px;
}

.message-avatar {
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  background-color: #f0f2f5;
  margin-right: 10px;
  flex-shrink: 0;
}

.user-message .message-avatar {
  background-color: #ecf5ff;
}

.ai-message .message-avatar {
  background-color: #f0f9eb;
}

.message-content {
  flex: 1;
}

.message-text {
  background-color: white;
  padding: 10px 15px;
  border-radius: 8px;
  margin-bottom: 5px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.1);
}

.user-message .message-text {
  background-color: #ecf5ff;
}

.ai-message .message-text {
  background-color: #f0f9eb;
}

.message-time {
  font-size: 12px;
  color: #909399;
  margin-bottom: 5px;
}

.message-sources {
  margin-top: 10px;
  padding: 8px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.sources-title {
  font-size: 12px;
  color: #606266;
  margin-bottom: 5px;
}

.chat-input {
  margin-top: 15px;
}

.input-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
}

.stat-item {
  margin-bottom: 15px;
}

.stat-label {
  font-size: 12px;
  color: #909399;
  margin-bottom: 5px;
}

.stat-value {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.stat-value.highlight {
  color: #409eff;
}

.stat-value.small {
  font-size: 14px;
  font-weight: normal;
}

.tips-list {
  padding-left: 20px;
  margin: 0;
}

.tips-list li {
  margin-bottom: 8px;
  font-size: 14px;
  color: #606266;
}

/* Markdown样式 */
:deep(.message-text) {
  line-height: 1.6;
}

:deep(.message-text h1),
:deep(.message-text h2),
:deep(.message-text h3),
:deep(.message-text h4),
:deep(.message-text h5),
:deep(.message-text h6) {
  margin: 10px 0;
}

:deep(.message-text p) {
  margin: 10px 0;
}

:deep(.message-text pre) {
  background-color: #2d2d2d;
  color: #f8f8f2;
  padding: 12px;
  border-radius: 4px;
  overflow-x: auto;
  margin: 10px 0;
}

:deep(.message-text code) {
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  background-color: #f5f5f5;
  padding: 2px 4px;
  border-radius: 3px;
  font-size: 14px;
}

:deep(.message-text pre code) {
  background-color: transparent;
  padding: 0;
}

:deep(.message-text ul),
:deep(.message-text ol) {
  padding-left: 20px;
  margin: 10px 0;
}

:deep(.message-text li) {
  margin-bottom: 5px;
}

:deep(.message-text table) {
  width: 100%;
  border-collapse: collapse;
  margin: 10px 0;
}

:deep(.message-text th),
:deep(.message-text td) {
  border: 1px solid #dfe2e5;
  padding: 6px 10px;
}

:deep(.message-text th) {
  background-color: #f6f8fa;
}
</style>