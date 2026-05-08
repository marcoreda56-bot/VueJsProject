import { defineStore } from 'pinia'
import { employerApi } from '@/api/services/api'

export const useEmployerStore = defineStore('employer', {
  state: () => ({
    profile: null,
    myJobs: [],
    applications: [],
    currentApplication: null,
    loading: false,
    error: null,
  }),

  actions: {
    async fetchProfile() {
      this.loading = true
      try {
        this.profile = await employerApi.getProfile()
      } catch (err) {
        this.error = 'Failed to load employer profile'
      } finally {
        this.loading = false
      }
    },

    async updateProfile(data) {
      try {
        const updated = await employerApi.updateProfile(data)
        this.profile = updated
        return updated
      } catch (err) {
        throw err
      }
    },

    async fetchMyJobs() {
      this.loading = true
      try {
        this.myJobs = await employerApi.getJobs()
      } catch (err) {
        this.error = 'Failed to load your jobs'
      } finally {
        this.loading = false
      }
    },

    async fetchApplications(params = {}) {
      this.loading = true
      try {
        const response = await employerApi.getApplications(params)
        this.applications = response.data
      } catch (err) {
        this.error = 'Failed to load applications'
      } finally {
        this.loading = false
      }
    },

    async updateApplicationStatus(id, statusData) {
      try {
        const updated = await employerApi.updateAppStatus(id, statusData)
        const index = this.applications.findIndex((app) => app.id === id)
        if (index !== -1) this.applications[index] = updated
        return updated
      } catch (err) {
        throw err
      }
    },

    async scheduleInterview(applicationId, interviewData) {
      try {
        const response = await employerApi.scheduleInterview(applicationId, interviewData)
        return response
      } catch (err) {
        throw err
      }
    },
  },
})
