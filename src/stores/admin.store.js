import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import api, { usersApi, jobsApi, applicationsApi, employersApi, candidatesApi } from '@/api/services/api'

export const useAdminStore = defineStore('admin', () => {
  const users = ref([])
  const jobs = ref([])
  const applications = ref([])
  const employers = ref([])
  const candidates = ref([])
  const categories = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Stats
  const stats = computed(() => ({
    totalUsers: users.value.length,
    totalJobs: jobs.value.length,
    pendingJobs: jobs.value.filter(j => j.status === 'pending').length,
    activeJobs: jobs.value.filter(j => j.status === 'active').length,
    totalApplications: applications.value.length,
    totalEmployers: employers.value.length,
    totalCandidates: users.value.filter(u => u.role === 'candidate').length
  }))

  const fetchAllData = async (force = false) => {
    // Skip re-fetching if data is already loaded (unless forced)
    if (!force && users.value.length > 0) return

    loading.value = true
    error.value = null
    try {
      const [uRes, jRes, aRes, eRes, catRes, cRes] = await Promise.all([
        usersApi.getAll(),
        jobsApi.getAll(),
        applicationsApi.getAll(),
        employersApi.getAll(),
        api.get('/categories'),
        candidatesApi.getAll()
      ])
      users.value = uRes.data
      jobs.value = jRes.data
      applications.value = aRes.data
      employers.value = eRes.data
      categories.value = catRes.data
      candidates.value = cRes.data
    } catch (err) {
      error.value = err.message
      console.error('Admin Store: Failed to fetch data', err)
    } finally {
      loading.value = false
    }
  }

  const updateUserStatus = async (userId, status) => {
    try {
      await usersApi.update(userId, { is_active: status })
      const index = users.value.findIndex(u => u.id === userId)
      if (index !== -1) {
        users.value[index].is_active = status
      }
    } catch (err) {
      console.error('Admin Store: Failed to update user status', err)
      throw err
    }
  }

  const updateJobStatus = async (jobId, status) => {
    try {
      await jobsApi.update(jobId, { status })
      const index = jobs.value.findIndex(j => j.id === jobId)
      if (index !== -1) {
        jobs.value[index].status = status
      }
    } catch (err) {
      console.error('Admin Store: Failed to update job status', err)
      throw err
    }
  }

  const createJob = async (jobData) => {
    try {
      const now = new Date().toISOString()
      const response = await jobsApi.create({
        ...jobData,
        slug: jobData.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
        created_at: now,
        updated_at: now,
        views: 0,
        applications_count: 0
      })
      jobs.value.unshift(response.data)
      return response.data
    } catch (err) {
      console.error('Admin Store: Failed to create job', err)
      throw err
    }
  }

  const deleteJob = async (jobId) => {
    try {
      await jobsApi.delete(jobId)
      jobs.value = jobs.value.filter(j => j.id !== jobId)
    } catch (err) {
      console.error('Admin Store: Failed to delete job', err)
      throw err
    }
  }

  return {
    users,
    jobs,
    applications,
    employers,
    candidates,
    categories,
    loading,
    error,
    stats,
    fetchAllData,
    updateUserStatus,
    updateJobStatus,
    createJob,
    deleteJob
  }
})
