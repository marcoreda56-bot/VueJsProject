import { ref } from 'vue'
import { defineStore } from 'pinia'
import { jobsApi, categoriesApi, employersApi } from '@/api/services/api'
export const useJobsStore = defineStore('jobs', () => {
  const jobs = ref([])
  const categories = ref([])
  const employers = ref([])
  const loading = ref(false)
  const activeJobs = () => jobs.value.filter((job) => job.status === 'active')
  const featuredJobs = () => activeJobs().slice(0, 6)
  const jobsByCategory = (categoryId) =>
    jobs.value.filter((job) => String(job.category_id) === String(categoryId))

  const jobCountByCategory = (categoryId) => jobsByCategory(categoryId).length

  const fetchActiveJobs = async () => {
    try {
      loading.value = true
      const response = await jobsApi.getActive()
      jobs.value = response.data
    } catch (err) {
      console.error('Fetch Jobs Error:', err)
    } finally {
      loading.value = false
    }
  }

  const fetchAllCategories = async () => {
    try {
      const response = await categoriesApi.getActive()
      categories.value = response.data.map((cat) => ({
        ...cat,
        jobs_count: jobCountByCategory(cat.id),
      }))
    } catch (err) {
      console.error('Fetch Categories Error:', err)
    }
  }

  const fetchEmployers = async () => {
    try {
      const response = await employersApi.getAll()
      employers.value = response.data
    } catch (err) {
      console.error('Fetch Employers Error:', err)
    }
  }

  const initialize = async () => {
    loading.value = true
    try {
      await fetchActiveJobs()
      await Promise.all([fetchAllCategories(), fetchEmployers()])
    } finally {
      loading.value = false
    }
  }

  return {
    jobs,
    categories,
    employers,
    loading,
    activeJobs,
    featuredJobs,
    jobsByCategory,
    jobCountByCategory,
    fetchActiveJobs,
    fetchAllCategories,
    fetchEmployers,
    initialize,
  }
})
