import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getSubmissionList, getSubmissionDetail } from '@/api'

export const useSubmissionStore = defineStore('submission', () => {
  // 状态
  const submissions = ref([])
  const currentSubmission = ref(null)
  const loading = ref(false)

  // 获取提交列表
  const fetchSubmissions = async (params = {}) => {
    loading.value = true
    try {
      const res = await getSubmissionList(params)
      submissions.value = res.data
      return res.data
    } catch (error) {
      console.error('获取提交列表失败:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // 获取提交详情
  const fetchSubmissionDetail = async (submissionId) => {
    loading.value = true
    try {
      const res = await getSubmissionDetail(submissionId)
      currentSubmission.value = res.data
      return res.data
    } catch (error) {
      console.error('获取提交详情失败:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // 清空当前提交
  const clearCurrentSubmission = () => {
    currentSubmission.value = null
  }

  return {
    submissions,
    currentSubmission,
    loading,
    fetchSubmissions,
    fetchSubmissionDetail,
    clearCurrentSubmission
  }
})
