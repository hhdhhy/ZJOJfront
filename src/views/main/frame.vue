<template>
  <div class="common-layout">
    <el-container>
      <!-- 顶部导航栏 -->
      <el-header class="header-container">
        <HeaderNav 
          :sidebar-collapsed="sidebarCollapsed" 
          :user-info="userInfo"
          @toggle-sidebar="toggleSidebar"
          @view-profile="goToPage('profile')"
          @settings="settings"
          @logout="logout"
        />
      </el-header>

      <el-container>
        <!-- 侧边栏 -->
        <Sidebar 
          :sidebar-collapsed="sidebarCollapsed"
          :active-menu="activeMenu"
          @menu-select="handleMenuSelect"
        />

        <!-- 主内容区 -->
        <el-main class="main-content">
          <div class="content-wrapper">
            <!-- 面包屑 -->
            <el-breadcrumb separator="/" class="breadcrumb" v-if="currentPage !== 'home'">
              <el-breadcrumb-item @click="goToPage('home')" style="cursor: pointer;">首页</el-breadcrumb-item>
              <el-breadcrumb-item>{{ activeBreadcrumb }}</el-breadcrumb-item>
            </el-breadcrumb>

            <!-- 内容区域 -->
            <div class="content-area">
              <!-- 我的信息页面 -->
              <div v-if="currentPage === 'profile'" class="page-content">
                <UserProfile :user-info="userInfo" />
              </div>

              <!-- 题目列表页面 -->
              <div v-if="currentPage === 'problems'" class="page-content">
                <ProblemList />
              </div>

              <!-- 知识问答页面 -->
              <div v-if="currentPage === 'qa'" class="page-content">
                <KnowledgeQA />
              </div>

              <!-- 默认首页 -->
              <div v-if="currentPage === 'home'" class="page-content">
                <el-row :gutter="20">
                  <el-col :span="18">
                    <el-card class="welcome-card">
                      <h2>欢迎来到 ZJOJ 在线判题系统</h2>
                      <p>在这里你可以练习编程技能，参与算法竞赛，提升编程能力。</p>
                    </el-card>
                    
                    <el-card class="recent-card">
                      <template #header>
                        <div class="card-header">
                          <span>最近提交</span>
                        </div>
                      </template>
                      
                      <el-table :data="recentSubmissions" style="width: 100%">
                        <el-table-column prop="problem" label="题目" />
                        <el-table-column prop="result" label="结果" width="120">
                          <template #default="scope">
                            <el-tag 
                              :type="getResultType(scope.row.result)" 
                              disable-transitions
                            >
                              {{ scope.row.result }}
                            </el-tag>
                          </template>
                        </el-table-column>
                        <el-table-column prop="language" label="语言" width="100" />
                        <el-table-column prop="time" label="时间" width="150" />
                      </el-table>
                    </el-card>
                  </el-col>
                  
                  <el-col :span="6">
                    <el-card class="info-card">
                      <template #header>
                        <div class="card-header">
                          <span>快速导航</span>
                        </div>
                      </template>
                      
                      <div class="quick-links">
                        <el-button type="primary" @click="goToPage('problems')" round class="quick-link-btn">题目列表</el-button>
                        <el-button type="success" @click="goToPage('qa')" round class="quick-link-btn">知识问答</el-button>
                        <el-button type="warning" @click="goToContest" round class="quick-link-btn">参加竞赛</el-button>
                      </div>
                    </el-card>
                    
                    <el-card class="news-card">
                      <template #header>
                        <div class="card-header">
                          <span>系统公告</span>
                        </div>
                      </template>
                      
                      <ul class="news-list">
                        <li v-for="news in newsList" :key="news.id">{{ news.title }}</li>
                      </ul>
                    </el-card>
                  </el-col>
                </el-row>
              </div>
            </div>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import HeaderNav from '@/components/HeaderNav.vue'
import Sidebar from '@/components/Sidebar.vue'
import UserProfile from '@/components/UserProfile.vue'
import ProblemList from '@/components/ProblemList.vue'
import KnowledgeQA from '@/components/KnowledgeQA.vue'

const router = useRouter()

// 侧边栏状态
const sidebarCollapsed = ref(false)

// 当前页面状态
const currentPage = ref('home')
const activeMenu = ref('home')
const activeBreadcrumb = ref('首页')

// 用户信息
const userInfo = ref({
  username: 'testuser',
  nickname: '测试用户',
  email: 'test@example.com',
  joinDate: '2023-01-01',
  solvedProblems: 15,
  submissions: 32,
  rating: 1500,
  signature: '努力刷题中...'
})

// 最近提交
const recentSubmissions = ref([
  { problem: '两数之和', result: '通过', language: 'Java', time: '2023-05-01 10:30' },
  { problem: '三数之和', result: '编译错误', language: 'C++', time: '2023-05-01 09:15' },
  { problem: '最长不重复子串', result: '通过', language: 'Python', time: '2023-04-30 22:45' },
  { problem: '反转链表', result: '超时', language: 'Java', time: '2023-04-30 18:20' }
])

// 系统公告
const newsList = ref([
  { id: 1, title: '五一劳动节放假通知' },
  { id: 2, title: '系统维护升级公告' },
  { id: 3, title: '新增Python3.9支持' },
  { id: 4, title: '周末编程挑战赛报名' }
])

// 方法
const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value
}

const handleMenuSelect = (index) => {
  goToPage(index)
}

const goToPage = (page) => {
  currentPage.value = page
  activeMenu.value = page
  
  switch(page) {
    case 'home':
      activeBreadcrumb.value = '首页'
      break
    case 'profile':
      activeBreadcrumb.value = '我的信息'
      break
    case 'problems':
      activeBreadcrumb.value = '题目列表'
      break
    case 'qa':
      activeBreadcrumb.value = '知识问答'
      break
    case 'status':
      activeBreadcrumb.value = '评测状态'
      break
    case 'contest':
      activeBreadcrumb.value = '竞赛'
      break
    default:
      activeBreadcrumb.value = '首页'
  }
}

const settings = () => {
  ElMessage.info('进入设置页面')
}

const logout = () => {
  ElMessageBox.confirm(
    '确定要退出登录吗？',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    // 这里应该调用实际的登出逻辑
    localStorage.removeItem('token')
    router.push('/login')
    ElMessage.success('已退出登录')
  }).catch(() => {
    // 取消
  })
}

const goToContest = () => {
  ElMessage.info('即将开放竞赛功能')
}

// 提交结果类型
const getResultType = (result) => {
  if (result === '通过') return 'success'
  if (result === '编译错误') return 'danger'
  if (result === '超时') return 'warning'
  return 'info'
}
</script>

<style scoped>
.common-layout {
  height: 100vh;
}

.header-container {
  padding: 0;
  margin: 0;
  height: 60px;
}

.el-header {
  padding: 0;
}

.main-content {
  background-color: #f5f7f9;
  padding: 20px;
}

.content-wrapper {
  height: 100%;
}

.breadcrumb {
  margin-bottom: 20px;
}

.page-content {
  background-color: #fff;
  border-radius: 4px;
  padding: 20px;
}

.info-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.welcome-card {
  margin-bottom: 20px;
  padding: 30px;
  text-align: center;
}

.welcome-card h2 {
  margin-top: 0;
}

.quick-links {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 0;
}

.quick-link-btn {
  width: 100% !important;
  margin-bottom: 12px;
}

.quick-link-btn:last-child {
  margin-bottom: 0;
}

.news-list {
  list-style: none;
  padding: 0;
}

.news-list li {
  padding: 5px 0;
  border-bottom: 1px solid #eee;
  color: #606266;
  font-size: 14px;
}

.news-list li:last-child {
  border-bottom: none;
}
</style>