import { defineStore } from 'pinia'
import { candidateApi } from '@/api/services/api'

export const useCandidateStore = defineStore('candidate', {
  state: () => ({
    profile: null,
    applications: [],
    currentApplication: null,
    savedJobs: [],
    resumes: [],
    reviews: [],
    loading: false,
    error: null,
  }),

  actions: {
    // Profile
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

    // Education
    async addEducation(data) {
      this.loading = true
      try {
        await candidateApi.addEducation(data)
        await this.fetchProfile()
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to add education'
        throw err
      } finally {
        this.loading = false
      }
    },

    async updateEducation(id, data) {
      this.loading = true
      try {
        await candidateApi.updateEducation(id, data)
        await this.fetchProfile()
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to update education'
        throw err
      } finally {
        this.loading = false
      }
    },

    async deleteEducation(id) {
      this.loading = true
      try {
        await candidateApi.deleteEducation(id)
        await this.fetchProfile()
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to delete education'
        throw err
      } finally {
        this.loading = false
      }
    },

    // Experience
    async addExperience(data) {
      this.loading = true
      try {
        await candidateApi.addExperience(data)
        await this.fetchProfile()
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to add experience'
        throw err
      } finally {
        this.loading = false
      }
    },

    async updateExperience(id, data) {
      this.loading = true
      try {
        await candidateApi.updateExperience(id, data)
        await this.fetchProfile()
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to update experience'
        throw err
      } finally {
        this.loading = false
      }
    },

    async deleteExperience(id) {
      this.loading = true
      try {
        await candidateApi.deleteExperience(id)
        await this.fetchProfile()
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to delete experience'
        throw err
      } finally {
        this.loading = false
      }
    },

    // Skills
    async syncSkills(skills) {
      this.loading = true
      try {
        await candidateApi.addSkills({ skills })
        await this.fetchProfile()
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to sync skills'
        throw err
      } finally {
        this.loading = false
      }
    },

    // Resumes
    async fetchResumes() {
      this.loading = true
      try {
        this.resumes = await candidateApi.getResumes()
      } catch (err) {
        this.error = 'Failed to load resumes'
      } finally {
        this.loading = false
      }
    },

    async uploadResume(formData) {
      this.loading = true
      try {
        const response = await candidateApi.uploadResume(formData)
        await this.fetchResumes()
        return response
      } catch (err) {
        this.error = 'Upload failed'
        throw err
      } finally {
        this.loading = false
      }
    },

    async setResumeDefault(id) {
      try {
        await candidateApi.setResumeDefault(id)
        await this.fetchResumes()
      } catch (err) {
        this.error = 'Failed to set default resume'
        throw err
      }
    },

    async deleteResume(id) {
      try {
        await candidateApi.deleteResume(id)
        await this.fetchResumes()
      } catch (err) {
        this.error = 'Failed to delete resume'
        throw err
      }
    },

    // Applications
    async fetchApplications(params = {}) {
      this.loading = true
      try {
        const response = await candidateApi.getApplications(params)
        this.applications = response.data || response || []
      } catch (err) {
        this.error = 'Failed to load applications'
        this.applications = []
      } finally {
        this.loading = false
      }
    },

    async fetchApplication(id) {
      this.loading = true
      try {
        this.currentApplication = await candidateApi.getApplication(id)
        return this.currentApplication
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to load application'
        throw err
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

    async withdrawApplication(id, reason = '') {
      try {
        await candidateApi.withdrawApplication(id, reason)
        const app = this.applications.find((a) => a.id === id)
        if (app) {
          app.current_status = 'withdrawn'
          app.withdrawn_at = new Date().toISOString()
        }
        if (this.currentApplication && this.currentApplication.id === id) {
          this.currentApplication.current_status = 'withdrawn'
          this.currentApplication.withdrawn_at = new Date().toISOString()
        }
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to withdraw'
        throw err
      }
    },

    // Saved Jobs
    async fetchSavedJobs() {
      this.loading = true
      try {
        this.savedJobs = await candidateApi.getSavedJobs()
      } catch (err) {
        this.error = 'Failed to load saved jobs'
      } finally {
        this.loading = false
      }
    },

    async saveJob(jobId, notes = '') {
      try {
        await candidateApi.saveJob(jobId, notes)
        await this.fetchSavedJobs()
      } catch (err) {
        if (err.response?.status === 409) {
          this.error = 'Job already saved'
        } else {
          this.error = err.response?.data?.message || 'Failed to save job'
        }
        throw err
      }
    },

    async unsaveJob(jobId) {
      try {
        await candidateApi.unsaveJob(jobId)
        this.savedJobs = this.savedJobs.filter((sj) => sj.job_id !== jobId)
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to remove saved job'
        throw err
      }
    },

    // Reviews
    async fetchReviews() {
      this.loading = true
      try {
        this.reviews = await candidateApi.getReviews()
      } catch (err) {
        this.error = 'Failed to load reviews'
      } finally {
        this.loading = false
      }
    },

    async submitReview(data) {
      this.loading = true
      try {
        await candidateApi.submitReview(data)
        await this.fetchReviews()
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to submit review'
        throw err
      } finally {
        this.loading = false
      }
    },

    async updateReview(id, data) {
      this.loading = true
      try {
        await candidateApi.updateReview(id, data)
        await this.fetchReviews()
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to update review'
        throw err
      } finally {
        this.loading = false
      }
    },

    async deleteReview(id) {
      try {
        await candidateApi.deleteReview(id)
        this.reviews = this.reviews.filter((r) => r.id !== id)
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to delete review'
        throw err
      }
    },
  },
})
