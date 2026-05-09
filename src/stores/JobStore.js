import { defineStore } from 'pinia'
import { publicApi, employerApi } from '@/api/services/api'
import api from '@/api/services/api'
export const useJobStore = defineStore('jobs', {
  state: () => ({
    jobs: [],
    currentJob: null,
    pagination: {
      currentPage: 1,
      lastPage: 1,
      total: 0,
    },
    categories: [],
    loading: false,
    error: null,
  }),

  actions: {
    /**
     * @param {Object} filters
     */
    async fetchJobs(filters = {}) {
      this.loading = true
      this.error = null
      try {
        const response = await publicApi.getJobs(filters)

        this.jobs = response.data || response

        if (response.meta) {
          this.pagination = {
            currentPage: response.meta.current_page,
            lastPage: response.meta.last_page,
            total: response.meta.total,
          }
        }
      } catch (err) {
        this.error = 'Failed to fetch jobs'
        console.error(err)
      } finally {
        this.loading = false
      }
    },

    async fetchJobById(id) {
      this.loading = true
      try {
        const data = await api.get(`/jobs/${id}`)
        this.currentJob = data
        return data
      } catch (error) {
        console.error('Error fetching job details:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchCategories() {
      try {
        this.categories = await publicApi.getCategories()
      } catch (err) {
        console.error('Failed to fetch categories:', err)
      }
    },

    async createJob(jobData) {
      this.loading = true
      try {
        const newJob = await employerApi.createJob(jobData)
        this.jobs.unshift(newJob)
        return newJob
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to create job'
        throw err
      } finally {
        this.loading = false
      }
    },

    async updateJob(id, jobData) {
      this.loading = true
      try {
        const updatedJob = await employerApi.updateJob(id, jobData)
        const index = this.jobs.findIndex((j) => j.id === id)
        if (index !== -1) {
          this.jobs[index] = updatedJob
        }
        return updatedJob
      } catch (err) {
        this.error = 'Failed to update job'
        throw err
      } finally {
        this.loading = false
      }
    },
  },
})
