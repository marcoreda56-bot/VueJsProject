import { defineStore } from 'pinia'
import { employerApi } from '@/api/services/api'

export const useEmployerStore = defineStore('employer', {
  state: () => ({
    profile: null,
    myJobs: [],
    currentJob: null,
    applications: [],
    jobApplications: [],
    pipelineSummary: null,
    currentApplication: null,
    reviews: [],
    loading: false,
    error: null,
  }),

  actions: {
    // Profile
    async fetchProfile() {
      this.loading = true
      try {
        this.profile = await employerApi.getProfile()
      } catch (err) {
        this.error = 'Failed to load profile'
      } finally {
        this.loading = false
      }
    },

    async updateProfile(payload) {
      this.loading = true
      try {
        let data = payload
        // If logo or cover is a File, wrap in FormData and tag with file_type
        if (payload.logo instanceof File || payload.cover_image instanceof File) {
          data = new FormData()
          Object.keys(payload).forEach((key) => {
            if (payload[key] !== null && payload[key] !== undefined) {
              data.append(key, payload[key])
            }
          })
          if (payload.logo instanceof File) {
            data.append('file_type', 'company_logo')
          }
          if (payload.cover_image instanceof File) {
            data.append('file_type', 'company_cover')
          }
        }
        this.profile = await employerApi.updateProfile(data)
        return this.profile
      } catch (err) {
        this.error = err.response?.data?.message || 'Update failed'
        throw err
      } finally {
        this.loading = false
      }
    },

    // Jobs
    async fetchMyJobs(params = {}) {
      this.loading = true
      try {
        const res = await employerApi.getJobs(params)
        this.myJobs = res.data || res || []
      } catch (err) {
        this.error = 'Failed to load jobs'
        this.myJobs = []
      } finally {
        this.loading = false
      }
    },

    async fetchJobById(id) {
      this.loading = true
      try {
        this.currentJob = await employerApi.getJobDetails(id)
        return this.currentJob
      } catch (err) {
        this.error = 'Failed to load job'
        throw err
      } finally {
        this.loading = false
      }
    },

    async createJob(payload) {
      this.loading = true
      try {
        const job = await employerApi.createJob(payload)
        this.myJobs.unshift(job)
        return job
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to create job'
        throw err
      } finally {
        this.loading = false
      }
    },

    async updateJob(id, payload) {
      this.loading = true
      try {
        const job = await employerApi.updateJob(id, payload)
        const idx = this.myJobs.findIndex((j) => j.id === id)
        if (idx !== -1) this.myJobs[idx] = job
        if (this.currentJob?.id === id) this.currentJob = job
        return job
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to update job'
        throw err
      } finally {
        this.loading = false
      }
    },

    async changeJobStatus(id, status) {
      try {
        const job = await employerApi.updateJobStatus(id, status)
        const idx = this.myJobs.findIndex((j) => j.id === id)
        if (idx !== -1) this.myJobs[idx] = job
        if (this.currentJob?.id === id) this.currentJob = job
        return job
      } catch (err) {
        this.error = err.response?.data?.message || 'Status update failed'
        throw err
      }
    },

    async deleteJob(id) {
      try {
        await employerApi.deleteJob(id)
        this.myJobs = this.myJobs.filter((j) => j.id !== id)
      } catch (err) {
        this.error = err.response?.data?.message || 'Delete failed'
        throw err
      }
    },

    // Applications - Global Inbox
    async fetchApplications(params = {}) {
      this.loading = true
      try {
        const res = await employerApi.getApplications(params)
        this.applications = res.data || res || []
      } catch (err) {
        this.error = 'Failed to load applications'
        this.applications = []
      } finally {
        this.loading = false
      }
    },

    // Applications - Per-job Pipeline
    async fetchJobApplications(jobId, params = {}) {
      this.loading = true
      try {
        const res = await employerApi.getJobApplications(jobId, params)
        this.jobApplications = res.data || res || []
        this.pipelineSummary = res.pipeline_summary || null
      } catch (err) {
        this.error = 'Failed to load job applications'
        this.jobApplications = []
        this.pipelineSummary = null
      } finally {
        this.loading = false
      }
    },

    // Application Detail
    async fetchApplicationById(id) {
      this.loading = true
      try {
        this.currentApplication = await employerApi.getApplicationDetail(id)
        return this.currentApplication
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to load application'
        throw err
      } finally {
        this.loading = false
      }
    },

    // Move application through pipeline
    async updateApplicationStatus(id, status, notes = '') {
      try {
        const res = await employerApi.updateAppStatus(id, { status, notes })
        // Update in all lists
        const app = this.applications.find((a) => a.id === id)
        if (app) {
          app.current_status = res.current_status
          app.history = res.history
        }
        const jobApp = this.jobApplications.find((a) => a.id === id)
        if (jobApp) {
          jobApp.current_status = res.current_status
          jobApp.history = res.history
        }
        if (this.currentApplication?.id === id) {
          this.currentApplication.current_status = res.current_status
          this.currentApplication.history = res.history
        }
        return res
      } catch (err) {
        this.error = err.response?.data?.message || 'Status update failed'
        throw err
      }
    },

    // Interviews
    async scheduleInterview(appId, data) {
      try {
        const res = await employerApi.scheduleInterview(appId, data)
        // If application status auto-advanced, update it
        if (res.application_current_status && this.currentApplication?.id === appId) {
          this.currentApplication.current_status = res.application_current_status
        }
        // Refresh application detail to get updated interviews
        await this.fetchApplicationById(appId)
        return res
      } catch (err) {
        this.error = err.response?.data?.message || 'Interview scheduling failed'
        throw err
      }
    },

    async rescheduleInterview(appId, interviewId, data) {
      try {
        const res = await employerApi.rescheduleInterview(appId, interviewId, data)
        await this.fetchApplicationById(appId)
        return res
      } catch (err) {
        this.error = err.response?.data?.message || 'Reschedule failed'
        throw err
      }
    },

    async cancelInterview(appId, interviewId, note = '') {
      try {
        const res = await employerApi.cancelInterview(appId, interviewId, { cancellation_note: note })
        await this.fetchApplicationById(appId)
        return res
      } catch (err) {
        this.error = err.response?.data?.message || 'Cancel failed'
        throw err
      }
    },

    async markInterviewOutcome(appId, interviewId, status, notes = '') {
      try {
        const res = await employerApi.markInterviewOutcome(appId, interviewId, { status, notes })
        await this.fetchApplicationById(appId)
        return res
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to mark outcome'
        throw err
      }
    },

    // Reviews
    async fetchReviews() {
      this.loading = true
      try {
        this.reviews = await employerApi.getReviews()
      } catch (err) {
        this.error = 'Failed to load reviews'
        this.reviews = []
      } finally {
        this.loading = false
      }
    },

    async replyToReview(reviewId, message) {
      try {
        await employerApi.replyToReview(reviewId, { message })
        await this.fetchReviews()
      } catch (err) {
        this.error = err.response?.data?.message || 'Reply failed'
        throw err
      }
    },
  },
})
