<template>
  <div class="demo-container">
    <h2>Element Plus 组件演示</h2>
    
    <!-- 按钮 -->
    <el-card class="card">
      <template #header>
        <div class="card-header">
          <span>按钮组件</span>
        </div>
      </template>
      <div class="flex-container">
        <el-button>默认按钮</el-button>
        <el-button type="primary">主要按钮</el-button>
        <el-button type="success">成功按钮</el-button>
        <el-button type="info">信息按钮</el-button>
        <el-button type="warning">警告按钮</el-button>
        <el-button type="danger">危险按钮</el-button>
      </div>
    </el-card>

    <!-- 表单 -->
    <el-card class="card">
      <template #header>
        <div class="card-header">
          <span>表单组件</span>
        </div>
      </template>
      <el-form :model="form" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="输入框">
              <el-input v-model="form.input" placeholder="请输入内容" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="选择器">
              <el-select v-model="form.region" placeholder="请选择">
                <el-option label="区域一" value="shanghai" />
                <el-option label="区域二" value="beijing" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-form-item label="多选框">
          <el-checkbox-group v-model="form.type">
            <el-checkbox label="美食推荐" name="type" />
            <el-checkbox label="地推活动" name="type" />
            <el-checkbox label="线下主题活动" name="type" />
            <el-checkbox label="单纯品牌曝光" name="type" />
          </el-checkbox-group>
        </el-form-item>
        
        <el-form-item label="开关">
          <el-switch v-model="form.delivery" />
        </el-form-item>
        
        <el-form-item label="滑块">
          <el-slider v-model="form.sliderValue" :min="0" :max="100" />
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="onSubmit">提交</el-button>
          <el-button @click="onReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 对话框 -->
    <el-card class="card">
      <template #header>
        <div class="card-header">
          <span>对话框组件</span>
        </div>
      </template>
      <el-button type="primary" @click="dialogVisible = true">点击打开 Dialog</el-button>
      
      <el-dialog v-model="dialogVisible" title="提示" width="30%">
        <span>这是一段信息</span>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="dialogVisible = false">确定</el-button>
          </span>
        </template>
      </el-dialog>
    </el-card>

    <!-- 表格 -->
    <el-card class="card">
      <template #header>
        <div class="card-header">
          <span>表格组件</span>
        </div>
      </template>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="date" label="日期" width="180" />
        <el-table-column prop="name" label="姓名" width="180" />
        <el-table-column prop="address" label="地址" />
      </el-table>
    </el-card>

    <!-- 通知 -->
    <el-card class="card">
      <template #header>
        <div class="card-header">
          <span>通知组件</span>
        </div>
      </template>
      <el-button plain @click="openMessage">消息</el-button>
      <el-button plain @click="openSuccess">成功</el-button>
      <el-button plain @click="openWarning">警告</el-button>
      <el-button plain @click="openError">错误</el-button>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

const form = reactive({
  input: '',
  region: '',
  type: [],
  delivery: false,
  sliderValue: 50
})

const dialogVisible = ref(false)
const tableData = ref([
  {
    date: '2024-04-01',
    name: 'Tom',
    address: 'No.189, Grove St, Los Angeles',
  },
  {
    date: '2024-04-02',
    name: 'Jerry',
    address: 'No.189, Grove St, Los Angeles',
  },
  {
    date: '2024-04-03',
    name: 'Spike',
    address: 'No.189, Grove St, Los Angeles',
  },
  {
    date: '2024-04-04',
    name: 'Tyke',
    address: 'No.189, Grove St, Los Angeles',
  },
])

const onSubmit = () => {
  ElMessage.success('提交成功!')
}

const onReset = () => {
  form.input = ''
  form.region = ''
  form.type = []
  form.delivery = false
  form.sliderValue = 50
  ElMessage.info('已重置')
}

const openMessage = () => {
  ElMessage('这是一条消息提示')
}

const openSuccess = () => {
  ElMessage.success('这是一条成功的提示消息')
}

const openWarning = () => {
  ElMessage.warning('这是一条警告的提示消息')
}

const openError = () => {
  ElMessage.error('这是一条错误的提示消息')
}
</script>

<style scoped>
.demo-container {
  padding: 20px;
}

.card {
  margin-bottom: 20px;
}

.card-header {
  font-weight: bold;
}

.flex-container {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>