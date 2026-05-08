import { defineStore } from 'pinia'
import { candidateApi } from '@/api/services/api'

export const useCandidateStore = defineStore('candidate', {
  state: () => ({
    profile: null,
    applications: [],
    savedJobs: [],
    resumes: [],
    loading: false,
    error: null,
  }),

  actions: {
    async fetchProfile() {
      this.loading = true
      try {
        this.profile = await candidateApi.getProfile()
      } catch (err) {
        this.error = 'Failed to load profile'
      } finally {
        this.loading = false
      }
    },

    async updateProfile(data) {
      this.loading = true
      try {
        const updated = await candidateApi.updateProfile(data)
        this.profile = updated
        return updated
      } catch (err) {
        this.error = 'Failed to update profile'
        throw err
      } finally {
        this.loading = false
      }
    },

    async fetchApplications() {
      this.loading = true
      try {
        this.applications = await candidateApi.getApplications()
      } catch (err) {
        this.error = 'Failed to load applications'
      } finally {
        this.loading = false
      }
    },

    async applyForJob(applicationData) {
      this.loading = true
      try {
        const response = await candidateApi.applyForJob(applicationData)
        this.applications.unshift(response)
        return response
      } catch (err) {
        this.error = err.response?.data?.message || 'Application failed'
        throw err
      } finally {
        this.loading = false
      }
    },

    async withdrawApplication(id) {
      try {
        await candidateApi.withdrawApplication(id)
        this.applications = this.applications.map((app) =>
          app.id === id ? { ...app, status: 'withdrawn' } : app,
        )
      } catch (err) {
        this.error = 'Failed to withdraw'
        throw err
      }
    },

    async fetchSavedJobs() {
      try {
        this.savedJobs = await candidateApi.getSavedJobs()
      } catch (err) {
        console.error(err)
      }
    },

    async toggleSaveJob(jobId) {
      try {
        await candidateApi.toggleSaveJob(jobId)
        await this.fetchSavedJobs()
      } catch (err) {
        console.error(err)
      }
    },

    async uploadResume(formData) {
      this.loading = true
      try {
        const response = await candidateApi.uploadResume(formData)
        return response
      } catch (err) {
        this.error = 'Upload failed'
        throw err
      } finally {
        this.loading = false
      }
    },
  },
})
