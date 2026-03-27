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

    // داخل fetchDashboardData في ملف candidate.store.js

    async fetchDashboardData() {
      const auth = useAuthStore()
      const user = auth.user || JSON.parse(localStorage.getItem('user'))
      if (!user?.id) return

      this.loading = true
      try {
        const userId = String(user.id)

        const [appsRes, profileRes] = await Promise.all([
          applicationsApi.getAll(),
          // ندهنا الـ API اللي بيدور بـ ?user_id=
          candidatesApi.getById(userId).catch(() => null),
        ])

        // 1. معالجة التقديمات (Applications)
        if (appsRes && appsRes.data) {
          this.applications = appsRes.data.filter((app) => String(app.candidate_id) === userId)
        }

        // 2. الفخ هنا: لازم نتأكد هي Array ولا Object
        if (profileRes && profileRes.data) {
          // لو راجعة مصفوفة (بسبب الفلتر)، ناخد أول عنصر
          if (Array.isArray(profileRes.data)) {
            this.profile = profileRes.data.length > 0 ? profileRes.data[0] : null
          } else {
            // لو راجعة كائن مباشر (getById قديمة)
            this.profile = profileRes.data
          }
        }

        // 3. لو ملقيناش بروفايل خالص (لليوزر الجديد)، نجهز كائن "وهمي" عشان الـ UI ما يضربش
        if (!this.profile) {
          this.profile = {
            id: userId,
            user_id: userId, // مهم جداً للربط
            title: '',
            location: 'Egypt',
            bio: '',
            skills: [],
          }
        }

        console.log(`✅ Sync Complete: ${this.applications.length} Tracks Loaded.`)
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
