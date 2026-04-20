<template>
  <div class="common-layout">
    <el-container>
      <!-- 顶部导航栏 -->
      <el-header class="header-container">
        <HeaderNav 
          :sidebar-collapsed="sidebarCollapsed" 
          :user-info="authStore.user"
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
                <UserProfile :user-info="authStore.user" />
              </div>

              <!-- 题目列表页面 -->
              <div v-if="currentPage === 'problems'" class="page-content">
                <ProblemList @view-detail="handleViewProblemDetail" />
              </div>

              <!-- 创建题目页面 -->
              <div v-if="currentPage === 'create-problem'" class="page-content">
                <ProblemCreate @create-success="handleCreateSuccess" />
              </div>

              <!-- 测试用例上传页面 -->
              <div v-if="currentPage === 'upload-testcases'" class="page-content">
                <TestcaseUpload :problem-id="currentProblemId" @go-back="handleTestcaseGoBack" />
              </div>

              <!-- 题目详情页面 -->
              <div v-if="currentPage === 'problem-detail'" class="page-content">
                <ProblemDetail 
                  :problem-id="currentProblemId" 
                  @go-back="handleProblemDetailGoBack"
                  @edit-problem="handleEditProblem"
                />
              </div>

              <!-- 题目编辑页面 -->
              <div v-if="currentPage === 'problem-edit'" class="page-content">
                <ProblemEdit 
                  :problem-id="currentProblemId" 
                  @go-back="handleProblemEditGoBack"
                  @update-success="handleUpdateSuccess"
                />
              </div>

              <!-- 知识问答页面 -->
              <div v-if="currentPage === 'qa'" class="page-content">
                <KnowledgeQA />
              </div>

              <!-- 评测状态页面 -->
              <div v-if="currentPage === 'status'" class="page-content">
                <SubmissionList 
                  @view-detail="handleViewSubmissionDetail"
                  @view-problem="handleViewProblemFromSubmission"
                />
              </div>

              <!-- 提交详情页面 -->
              <div v-if="currentPage === 'submission-detail'" class="page-content">
                <SubmissionDetail 
                  :submission-id="currentSubmissionId"
                  @go-back="handleSubmissionDetailGoBack"
                  @view-problem="handleViewProblemFromSubmission"
                />
              </div>

              <!-- 默认首页 -->
              <div v-if="currentPage === 'home'" class="page-content">
                <el-card class="welcome-card" :shadow="'never'">
                  <h2>欢迎来到 ZJOJ 在线判题系统</h2>
                  <p>在这里你可以练习编程技能，参与算法竞赛，提升编程能力。</p>
                </el-card>
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
import ProblemCreate from '@/components/ProblemCreate.vue'
import TestcaseUpload from '@/components/TestcaseUpload.vue'
import ProblemDetail from '@/components/ProblemDetail.vue'
import ProblemEdit from '@/components/ProblemEdit.vue'
import SubmissionList from '@/components/SubmissionList.vue'
import SubmissionDetail from '@/components/SubmissionDetail.vue'
import KnowledgeQA from '@/components/KnowledgeQA.vue'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

// 侧边栏状态
const sidebarCollapsed = ref(false)

// 当前页面状态
const currentPage = ref('home')
const activeMenu = ref('home')
const activeBreadcrumb = ref('首页')
const currentProblemId = ref('')
const currentSubmissionId = ref('')

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
    case 'create-problem':
      activeBreadcrumb.value = '创建题目'
      break
    case 'upload-testcases':
      activeBreadcrumb.value = '上传测试用例'
      break
    case 'problem-detail':
      activeBreadcrumb.value = '题目详情'
      break
    case 'problem-edit':
      activeBreadcrumb.value = '编辑题目'
      break
    case 'qa':
      activeBreadcrumb.value = '知识问答'
      break
    case 'status':
      activeBreadcrumb.value = '评测状态'
      break
    case 'submission-detail':
      activeBreadcrumb.value = '提交详情'
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
    // 调用 auth store 的清除方法
    authStore.clearUserToken()
    router.push({name: 'login'})
    ElMessage.success('已退出登录')
  }).catch(() => {
    // 取消
  })
}

const goToContest = () => {
  ElMessage.info('即将开放竞赛功能')
}

// 处理查看题目详情
const handleViewProblemDetail = (problemId) => {
  currentProblemId.value = problemId
  goToPage('problem-detail')
}

// 处理题目创建成功
const handleCreateSuccess = (problemId) => {
  currentProblemId.value = problemId
  goToPage('upload-testcases')
}

// 处理测试用例页面返回
const handleTestcaseGoBack = () => {
  goToPage('problems')
}

// 处理题目详情页面返回
const handleProblemDetailGoBack = () => {
  goToPage('problems')
}

// 处理编辑题目
const handleEditProblem = () => {
  goToPage('problem-edit')
}

// 处理题目编辑页面返回
const handleProblemEditGoBack = () => {
  goToPage('problem-detail')
}

// 处理题目更新成功
const handleUpdateSuccess = (updatedProblem) => {
  // 可以选择刷新详情页或直接返回
  goToPage('problem-detail')
}

// 处理查看提交详情
const handleViewSubmissionDetail = (submissionId) => {
  currentSubmissionId.value = submissionId
  goToPage('submission-detail')
}

// 处理提交详情页面返回
const handleSubmissionDetailGoBack = () => {
  goToPage('status')
}

// 从提交页面跳转到题目
const handleViewProblemFromSubmission = (problemId) => {
  currentProblemId.value = problemId
  goToPage('problem-detail')
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
  background-color: #f5f7fa;
  padding: 20px;
  min-height: calc(100vh - 60px);
}

.content-wrapper {
  height: 100%;
}

.breadcrumb {
  margin-bottom: 20px;
  background: white;
  padding: 12px 20px;
  border-radius: 4px;
}

.page-content {
  background: white;
  border-radius: 4px;
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.welcome-card {
  padding: 40px;
  text-align: center;
}

.welcome-card :deep(.el-card__body) {
  box-shadow: none !important;
}

.welcome-card h2 {
  margin-bottom: 16px;
  font-size: 24px;
  color: #303133;
}

.welcome-card p {
  margin: 0;
  font-size: 16px;
  color: #606266;
}
</style>