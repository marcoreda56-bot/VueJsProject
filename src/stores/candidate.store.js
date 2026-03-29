import { defineStore } from 'pinia'
import { candidatesApi, applicationsApi } from '@/api/services/api'
import { useAuthStore } from './auth.store'

export const useCandidateStore = defineStore('candidate', {
  state: () => ({
    profile: null,
    applications: [],
    loading: false,
  }),

  actions: {
    async initialize() {
      await this.fetchDashboardData()
    },

    async fetchDashboardData() {
      const auth = useAuthStore()
      const user = auth.user || JSON.parse(localStorage.getItem('user'))
      if (!user?.id) return

      this.loading = true
      try {
        const userId = String(user.id)

        const [appsRes, profileRes] = await Promise.all([
          applicationsApi.getAll(),
          candidatesApi.getById(userId).catch(() => null),
        ])

        if (appsRes && appsRes.data) {
          this.applications = appsRes.data.filter((app) => String(app.candidate_id) === userId)
        }

        if (profileRes && profileRes.data) {
          this.profile = profileRes.data
        } else {
          this.profile = {
            id: userId,
            title: '',
            location: 'Egypt',
            bio: '',
            skills: [],
          }
        }

        console.log(`Sync Complete: ${this.applications.length} Tracks Loaded.`)
      } catch (error) {
        console.error('Store Fetch Error:', error)
      } finally {
        this.loading = false
      }
    },

    async applyForJob(jobId, coverLetter) {
      const auth = useAuthStore()
      const user = auth.user || JSON.parse(localStorage.getItem('user'))
      const userId = String(user.id)

      try {
        this.loading = true
        const payload = {
          candidate_id: userId,
          job_id: String(jobId),
          cover_letter: coverLetter,
          candidate_snapshot: {
            name: user.name,
            email: user.email,
            title: this.profile?.title || 'Professional Candidate',
            location: this.profile?.location || 'Egypt',
            bio: this.profile?.bio || '',
          },
          status: 'pending',
          applied_at: new Date().toISOString(),
        }

        const res = await applicationsApi.create(payload)

        if (res.data) {
          this.applications.unshift(res.data)
        }
        return res.data
      } catch (err) {
        console.error('Apply Error:', err)
        throw err
      } finally {
        this.loading = false
      }
    },

    async updateProfile(profileData) {
      const auth = useAuthStore()
      const user = auth.user || JSON.parse(localStorage.getItem('user'))
      if (!user?.id) return

      this.loading = true
      try {
        const userId = String(user.id)
        const payload = {
          ...profileData,
          id: userId,
          updated_at: new Date().toISOString(),
        }

        let res
        try {
          res = await candidatesApi.update(userId, payload)
        } catch (err) {
          if (err.response?.status === 404) {
            res = await candidatesApi.create(payload)
          } else {
            throw err
          }
        }

        this.profile = res.data
        return res.data
      } catch (error) {
        console.error(' Save Profile Error:', error)
        throw error
      } finally {
        this.loading = false
      }
    },
    async withdrawApplication(appId) {
      this.loading = true
      try {
        await applicationsApi.delete(appId)

        this.applications = this.applications.filter((app) => String(app.id) !== String(appId))

        console.log(`Application ${appId} withdrawn successfully.`)
        return true
      } catch (error) {
        console.error('Withdraw Error:', error)
        throw error
      } finally {
        this.loading = false
      }
    },
  },
})
