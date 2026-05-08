import { defineStore } from 'pinia'
import { employerApi } from '@/api/services/api'

export const useEmployerStore = defineStore('employer', {
  state: () => ({
    profile: null,
    myJobs: [], // خليناها myJobs عشان تمشى مع الـ View
    applications: [], // ضفنا دى عشان الـ Dashboard محتاجها
    loading: false,
    error: null,
  }),

  actions: {
    async fetchMyJobs() {
      this.loading = true
      try {
        const response = await employerApi.getJobs()
        // Laravel بيبعت الداتا غالباً فى response.data
        this.myJobs = response.data || response || []
      } catch (err) {
        this.error = 'Failed to load jobs'
      } finally {
        this.loading = false
      }
    },

    async fetchApplications() {
      this.loading = true
      try {
        const response = await employerApi.getApplications() // تأكد ان الـ API ده متعرف
        this.applications = response.data || response || []
      } catch (err) {
        console.error('Failed to load applications', err)
      } finally {
        this.loading = false
      }
    },

    async postJob(payload) {
      this.loading = true
      try {
        const response = await employerApi.createJob(payload)
        // Laravel بيبعت الوظيفة الجديدة في response.data
        const newJob = response.data || response

        // نحدث المصفوفة اللي الـ Dashboard والـ ManageJobs شايفينها
        if (this.myJobs) {
          this.myJobs.unshift(newJob)
        }
        return newJob
      } catch (err) {
        // لو الـ Backend بعت 422 (Validation Error)
        this.error = err.response?.data?.message || 'Failed to post job'
        throw err.response?.data?.errors || err
      } finally {
        this.loading = false
      }
    },

    async updateProfile(profileData) {
      this.loading = true
      try {
        let payload = profileData
        if (profileData.logo_file || profileData.cover_file) {
          payload = new FormData()
          Object.keys(profileData).forEach((key) => {
            if (profileData[key] !== null) payload.append(key, profileData[key])
          })
        }
        const response = await employerApi.updateProfile(payload)
        this.profile = response.data || response
        return response
      } catch (err) {
        throw err.response?.data?.errors || 'Update failed'
      } finally {
        this.loading = false
      }
    },

    async changeJobStatus(id, status) {
      try {
        await employerApi.updateJobStatus(id, status)
        const index = this.myJobs.findIndex((j) => j.id === id)
        if (index !== -1) this.myJobs[index].status = status
      } catch (err) {
        console.error('Status update failed', err)
      }
    },
  },
})
