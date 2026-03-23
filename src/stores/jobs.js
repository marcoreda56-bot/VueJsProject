import { ref } from 'vue'
import { defineStore } from 'pinia'
import { jobsApi, categoriesApi, applicationsApi, employersApi } from '../api/api.js'

export const useJobsStore = defineStore('jobs', () => {
  // State
  const jobs = ref([])
  const categories = ref([])
  const employers = ref([])
  const loading = ref(false)
  const error = ref(null)
  const currentUserId = ref(null) // Simulate logged-in user

  // Getters
  const activeJobs = () => jobs.value.filter((job) => job.status === 'active')
  const featuredJobs = () => activeJobs().slice(0, 6)
  const jobsByCategory = (categoryId) => jobs.value.filter((job) => job.category_id === categoryId)
  const jobCountByCategory = (categoryId) => jobsByCategory(categoryId).length

  // Actions
  const fetchActiveJobs = async () => {
    try {
      loading.value = true
      error.value = null
      const response = await jobsApi.getActive()
      jobs.value = response.data
    } catch (err) {
      error.value = err.message
      console.error('Failed to fetch jobs:', err)
    } finally {
      loading.value = false
    }
  }

  const fetchAllCategories = async () => {
    try {
      const response = await categoriesApi.getActive()
      categories.value = response.data
      // Enrich with job counts
      categories.value.forEach((cat) => {
        cat.jobs_count = jobCountByCategory(cat.id)
      })
    } catch (err) {
      console.error('Failed to fetch categories:', err)
    }
  }

  const fetchEmployers = async () => {
    try {
      const response = await employersApi.getAll()
      employers.value = response.data
    } catch (err) {
      console.error('Failed to fetch employers:', err)
    }
  }

  const fetchJobById = async (id) => {
    try {
      const response = await jobsApi.getById(id)
      return response.data
    } catch (err) {
      console.error('Failed to fetch job:', err)
      throw err
    }
  }

  const applyForJob = async (jobId) => {
    if (!currentUserId.value) {
      throw new Error('User not logged in')
    }
    try {
      const application = await applicationsApi.create({
        job_id: jobId,
        candidate_id: currentUserId.value,
        cover_letter: 'Auto-generated application via Jobs Store',
        status: 'pending',
      })
      return application.data
    } catch (err) {
      console.error('Failed to apply for job:', err)
      throw err
    }
  }

  const getJobApplications = (jobId) => {
    return applications.value?.filter((app) => app.job_id === jobId) || []
  }

  // Init
  const initialize = async () => {
    await Promise.all([fetchActiveJobs(), fetchAllCategories(), fetchEmployers()])
  }

  return {
    jobs,
    categories,
    employers,
    loading,
    error,
    activeJobs,
    featuredJobs,
    jobsByCategory,
    jobCountByCategory,
    fetchActiveJobs,
    fetchAllCategories,
    fetchEmployers,
    fetchJobById,
    applyForJob,
    getJobApplications,
    initialize,
    setCurrentUser: (userId) => {
      currentUserId.value = userId
    },
  }
})
