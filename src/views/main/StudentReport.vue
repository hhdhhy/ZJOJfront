<script setup>
import { ref, onMounted } from 'vue'
import { getStudentReport } from '@/api/modules/ai'
import { ElMessage } from 'element-plus'

const loading = ref(false)
const report = ref(null)
const days = ref(7)

// 获取学情报告
const fetchReport = async () => {
  loading.value = true
  try {
    const res = await getStudentReport({ days: days.value })
    report.value = res.data
  } catch (err) {
    ElMessage.error('获取学情报告失败')
    console.error(err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchReport()
})
</script>

<template>
  <div class="report-container">
    <div class="page-header">
      <h2>学情分析报告</h2>
      <el-select v-model="days" @change="fetchReport" style="width: 150px">
        <el-option label="近7天" :value="7" />
        <el-option label="近30天" :value="30" />
        <el-option label="近90天" :value="90" />
      </el-select>
    </div>

    <div v-loading="loading" class="report-content">
      <el-empty v-if="!report" description="暂无报告数据" />
      
      <template v-else>
        <!-- 报告摘要 -->
        <el-card class="summary-card">
          <h3>{{ report.report_type }}</h3>
          <p class="period">{{ report.period }}</p>
          <p class="summary">{{ report.summary }}</p>
        </el-card>

        <!-- 统计数据 -->
        <el-row :gutter="20" class="stats-row">
          <el-col :span="6">
            <el-card class="stat-card">
              <div class="stat-value">{{ report.statistics.total_submissions }}</div>
              <div class="stat-label">总提交数</div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card class="stat-card">
              <div class="stat-value">{{ report.statistics.accepted_count }}</div>
              <div class="stat-label">通过数</div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card class="stat-card">
              <div class="stat-value">{{ (report.statistics.acceptance_rate * 100).toFixed(1) }}%</div>
              <div class="stat-label">通过率</div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card class="stat-card">
              <div class="stat-value">{{ report.statistics.problem_solved }}</div>
              <div class="stat-label">解决题目数</div>
            </el-card>
          </el-col>
        </el-row>

        <!-- 错误分布 -->
        <el-card class="error-card" v-if="report.statistics.error_distribution">
          <h3>错误分布</h3>
          <el-table :data="Object.entries(report.statistics.error_distribution).map(([key, value]) => ({ type: key, count: value }))" style="width: 100%">
            <el-table-column prop="type" label="错误类型" width="150" />
            <el-table-column prop="count" label="次数" width="100" />
          </el-table>
        </el-card>

        <!-- 建议 -->
        <el-card class="recommend-card" v-if="report.recommendations">
          <h3>学习建议</h3>
          <ul class="recommend-list">
            <li v-for="(item, index) in report.recommendations" :key="index">{{ item }}</li>
          </ul>
        </el-card>

        <div class="generated-time">
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
