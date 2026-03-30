import { defineStore } from 'pinia'
import {
  candidatesApi,
  applicationsApi,
  skillsApi,
  candidateSkillsApi,
  candidateEducationApi,
  candidateExperienceApi,
} from '@/api/services/api'
import { useAuthStore } from './auth.store'

export const useCandidateStore = defineStore('candidate', {
  state: () => ({
    profile: null,
    applications: [],
    education: [],
    experience: [],
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

        const [appsRes, profileListRes] = await Promise.all([
          applicationsApi.getAll(),
          candidatesApi.getByUser(userId).catch(() => ({ data: [] })),
        ])

        if (appsRes && appsRes.data) {
          this.applications = appsRes.data.filter((app) => String(app.candidate_id) === userId)
        }

        const profileData = profileListRes.data?.[0]
        if (profileData) {
          this.profile = profileData
          const candidateId = profileData.id

          // Fetch related data using the real candidate ID
          const [eduRes, expRes] = await Promise.all([
            candidateEducationApi.getByCandidate(candidateId).catch(() => ({ data: [] })),
            candidateExperienceApi.getByCandidate(candidateId).catch(() => ({ data: [] })),
          ])

          this.education = eduRes.data
          this.experience = expRes.data
        } else {
          this.profile = {
            user_id: userId,
            title: '',
            location: 'Egypt',
            bio: '',
            skills: [],
          }
          this.education = []
          this.experience = []
        }

        console.log(`Sync Complete: ${this.applications.length} Tracks Loaded.`)
      } catch (error) {
        console.error('Store Fetch Error:', error)
      } finally {
        this.loading = false
      }
    },

    async updateProfile(profileData, educationData = null, experienceData = null) {
      const auth = useAuthStore()
      const user = auth.user || JSON.parse(localStorage.getItem('user'))
      if (!user?.id) return

      this.loading = true
      try {
        const userId = String(user.id)
        const profileId = this.profile?.id || userId

        // 1. Handle Skills
        const allSkillsRes = await skillsApi.getAll()
        const existingGlobalSkills = allSkillsRes.data
        const finalSkillIds = []

        if (Array.isArray(profileData.skills)) {
          for (const skill of profileData.skills) {
            if (typeof skill === 'string' && isNaN(Number(skill))) {
              let existingSkill = existingGlobalSkills.find(
                (s) => s.name.toLowerCase() === skill.toLowerCase(),
              )
              if (!existingSkill) {
                const newSkillRes = await skillsApi.create({ name: skill, category_id: 1 })
                existingSkill = newSkillRes.data
              }
              finalSkillIds.push(String(existingSkill.id))
            } else {
              finalSkillIds.push(String(skill))
            }
          }
        }

        const payload = {
          ...profileData,
          skills: finalSkillIds,
          user_id: userId,
          updated_at: new Date().toISOString(),
        }

        let res
        try {
          res = await candidatesApi.update(profileId, payload)
        } catch (err) {
          if (err.response?.status === 404) {
            res = await candidatesApi.create(payload)
          } else {
            throw err
          }
        }

        const updatedProfile = res.data
        const candidateId = updatedProfile.id
        this.profile = updatedProfile

        // 2. Sync Skills
        const currentLinksRes = await candidateSkillsApi.getByCandidate(candidateId)
        const currentLinks = currentLinksRes.data

        for (const skillId of finalSkillIds) {
          if (!currentLinks.some((link) => String(link.skill_id) === String(skillId))) {
            await candidateSkillsApi.create({
              candidate_id: candidateId,
              skill_id: skillId,
              level: 'intermediate',
            })
          }
        }
        for (const link of currentLinks) {
          if (!finalSkillIds.includes(String(link.skill_id))) {
            await candidateSkillsApi.delete(link.id)
          }
        }

        // 3. Sync Education
        if (educationData) {
          const currentEdu = this.education
          const toDelete = currentEdu.filter((e) => !educationData.some((ne) => ne.id === e.id))
          const toUpdate = educationData.filter((ne) => ne.id && currentEdu.some((e) => e.id === ne.id))
          const toAdd = educationData.filter((ne) => !ne.id)

          await Promise.all([
            ...toDelete.map((e) => candidateEducationApi.delete(e.id)),
            ...toUpdate.map((ne) => candidateEducationApi.update(ne.id, ne)),
            ...toAdd.map((ne) => candidateEducationApi.create({ ...ne, candidate_id: candidateId })),
          ])
          // Refetch to ensure state is clean
          const newEduRes = await candidateEducationApi.getByCandidate(candidateId)
          this.education = newEduRes.data
        }

        // 4. Sync Experience
        if (experienceData) {
          const currentExp = this.experience
          const toDelete = currentExp.filter((e) => !experienceData.some((ne) => ne.id === e.id))
          const toUpdate = experienceData.filter((ne) => ne.id && currentExp.some((e) => e.id === ne.id))
          const toAdd = experienceData.filter((ne) => !ne.id)

          await Promise.all([
            ...toDelete.map((e) => candidateExperienceApi.delete(e.id)),
            ...toUpdate.map((ne) => candidateExperienceApi.update(ne.id, ne)),
            ...toAdd.map((ne) => candidateExperienceApi.create({ ...ne, candidate_id: candidateId })),
          ])
          // Refetch
          const newExpRes = await candidateExperienceApi.getByCandidate(candidateId)
          this.experience = newExpRes.data
        }

        return updatedProfile
      } catch (error) {
        console.error(' Save Profile Error:', error)
        throw error
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

    async withdrawApplication(appId) {
      this.loading = true
      try {
        await applicationsApi.delete(appId)
        this.applications = this.applications.filter((app) => String(app.id) !== String(appId))
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
