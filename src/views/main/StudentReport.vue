<script setup>
import { ref, onMounted } from 'vue'
import { getStudentReport, getClassReport } from '@/api/modules/ai'
import { getClassList } from '@/api/modules/class'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const loading = ref(false)
const report = ref(null)
const days = ref(7)
const reportType = ref('student') // student 或 class
const classId = ref(null)
const classList = ref([])

// 获取班级列表
const fetchClassList = async () => {
  try {
    const res = await getClassList({ page_size: 100 })
    classList.value = res.data?.data || res.data?.results || []
  } catch (err) {
    console.error('获取班级列表失败', err)
  }
}

// 获取学情报告
const fetchReport = async () => {
  loading.value = true
  try {
    let res
    if (reportType.value === 'student') {
      res = await getStudentReport({ days: days.value })
    } else {
      // 教练查看班级报告,需要选择班级
      if (!classId.value) {
        ElMessage.warning('请先选择班级')
        return
      }
      res = await getClassReport(classId.value, { days: days.value })
    }
    report.value = res.data
  } catch (err) {
    ElMessage.error('获取学情报告失败')
    console.error(err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  // 学生只能看个人报告
  if (authStore.user?.role < 2) {
    reportType.value = 'student'
  }
  fetchClassList()
  fetchReport()
})
</script>

<template>
  <div class="report-container">
    <div class="page-header">
      <h2>学情分析报告</h2>
      <div class="header-controls">
        <el-select v-if="authStore.user?.role >= 2" v-model="reportType" @change="fetchReport" style="width: 150px; margin-right: 10px">
          <el-option label="个人报告" value="student" />
          <el-option label="班级报告" value="class" />
        </el-select>
        <el-select 
          v-if="reportType === 'class'" 
          v-model="classId" 
          @change="fetchReport" 
          placeholder="选择班级"
          style="width: 150px; margin-right: 10px"
        >
          <el-option 
            v-for="cls in classList" 
            :key="cls.id" 
            :label="cls.name" 
            :value="cls.id" 
          />
        </el-select>
        <el-select v-model="days" @change="fetchReport" style="width: 150px">
          <el-option label="近7天" :value="7" />
          <el-option label="近30天" :value="30" />
          <el-option label="近90天" :value="90" />
        </el-select>
      </div>
    </div>

    <div v-loading="loading" class="report-content">
      <el-empty v-if="!report" description="暂无报告数据" />
      
      <template v-else-if="report">
        <!-- 报告摘要 -->
        <el-card class="summary-card">
          <h3>{{ report.report_type }}</h3>
          <p class="period">{{ report.period }}</p>
          <p class="summary">{{ report.summary }}</p>
        </el-card>

        <!-- 统计数据 -->
        <el-row :gutter="20" class="stats-row" v-if="report.statistics">
          <el-col :span="6">
            <el-card class="stat-card">
              <div class="stat-value">{{ report.statistics.total_submissions }}</div>
              <div class="stat-label">总提交数</div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card class="stat-card">
              <div class="stat-value">{{ report.statistics.ac_count || 0 }}</div>
              <div class="stat-label">通过数</div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card class="stat-card">
              <div class="stat-value">{{ report.statistics.ac_rate || 0 }}%</div>
              <div class="stat-label">通过率</div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card class="stat-card">
              <div class="stat-value">{{ report.statistics.total_submissions - report.statistics.unsolved_count || 0 }}</div>
              <div class="stat-label">解决题目数</div>
            </el-card>
          </el-col>
        </el-row>

        <!-- 错误分布 -->
        <el-card class="error-card" v-if="report && report.statistics && report.statistics.common_errors">
          <h3>错误分布</h3>
          <el-table :data="Object.entries(report.statistics.common_errors).map(([key, value]) => ({ type: key, count: value }))" style="width: 100%">
            <el-table-column prop="type" label="错误类型" width="150" />
            <el-table-column prop="count" label="次数" width="100" />
          </el-table>
        </el-card>

        <!-- 建议 -->
        <el-card class="recommend-card" v-if="report.recommendations && report.recommendations.length > 0">
          <h3>学习建议</h3>
          <ul class="recommend-list">
            <li v-for="(item, index) in report.recommendations" :key="index">{{ item }}</li>
          </ul>
        </el-card>

        <div class="generated-time" v-if="report.generated_at">
          生成时间: {{ new Date(report.generated_at).toLocaleString('zh-CN') }}
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.report-container {
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  min-height: calc(100vh - 140px);
}

.page-header {
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-header h2 {
  margin: 0;
  font-size: 24px;
  color: #303133;
}

.header-controls {
  display: flex;
  gap: 10px;
}

.report-content {
  min-height: 400px;
}

.summary-card {
  margin-bottom: 20px;
}

.summary-card h3 {
  margin: 0 0 10px 0;
  font-size: 20px;
  color: #303133;
}

.period {
  color: #909399;
  margin: 5px 0;
}

.summary {
  color: #606266;
  line-height: 1.6;
  margin: 10px 0 0 0;
}

.stats-row {
  margin-bottom: 20px;
}

.stat-card {
  text-align: center;
  padding: 20px;
}

.stat-value {
  font-size: 32px;
  font-weight: bold;
  color: #409EFF;
  margin-bottom: 10px;
}

.stat-label {
  font-size: 14px;
  color: #909399;
}

.error-card, .recommend-card {
  margin-bottom: 20px;
}

.error-card h3, .recommend-card h3 {
  margin: 0 0 15px 0;
  font-size: 18px;
  color: #303133;
}

.recommend-list {
  margin: 0;
  padding-left: 20px;
}

.recommend-list li {
  margin-bottom: 10px;
  line-height: 1.6;
  color: #606266;
}

.generated-time {
  text-align: right;
  color: #909399;
  font-size: 12px;
  margin-top: 20px;
}
</style>
