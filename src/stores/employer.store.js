import { defineStore } from 'pinia'
import {
  jobsApi,
  applicationsApi,
  categoriesApi,
  employersApi,
  skillsApi,
  jobSkillsApi,
  candidatesApi,
  candidateSkillsApi,
  candidateEducationApi,
  candidateExperienceApi,
  usersApi,
} from '@/api/services/api'
import { useAuthStore } from './auth.store'

export const useEmployerStore = defineStore('employer', {
  state: () => ({
    jobs: [],
    applications: [],
    categories: [],
    skills: [],
    employerProfile: null,
    loading: false,
    error: null,
  }),

  getters: {
    activeJobs: (state) => state.jobs.filter((j) => j.status === 'active'),
    closedJobs: (state) => state.jobs.filter((j) => j.status === 'closed'),
    totalApplications: (state) => state.applications.length,
    pendingApplications: (state) =>
      state.applications.filter((a) => a.status === 'pending'),
    acceptedApplications: (state) =>
      state.applications.filter((a) => a.status === 'accepted'),
    rejectedApplications: (state) =>
      state.applications.filter((a) => a.status === 'rejected'),
  },

  actions: {
    async initialize() {
      await Promise.all([
        this.fetchMyJobs(),
        this.fetchCategories(),
        this.fetchSkills(),
        this.fetchEmployerProfile(),
      ])
      await this.fetchMyApplications()
    },

    _getCurrentUser() {
      const auth = useAuthStore()
      return auth.user || JSON.parse(localStorage.getItem('user'))
    },

    async fetchEmployerProfile() {
      const user = this._getCurrentUser()
      if (!user?.id) return
      try {
        const res = await employersApi.getByUser(user.id)
        this.employerProfile = res.data?.[0] || null
      } catch (err) {
        console.error('Failed to fetch employer profile:', err)
      }
    },

    async fetchMyJobs() {
      const user = this._getCurrentUser()
      if (!user?.id) return
      this.loading = true
      try {
        const res = await jobsApi.getAll()
        this.jobs = res.data.filter((j) => String(j.employer_id) === String(user.id))
      } catch (err) {
        console.error('Failed to fetch employer jobs:', err)
        this.error = err.message
      } finally {
        this.loading = false
      }
    },

    async fetchCategories() {
      try {
        const res = await categoriesApi.getAll()
        this.categories = res.data
      } catch (err) {
        console.error('Failed to fetch categories:', err)
      }
    },
    async fetchSkills() {
      try {
        const res = await skillsApi.getAll()
        this.skills = res.data
      } catch (err) {
        console.error('Failed to fetch skills:', err)
      }
    },

    async fetchMyApplications() {
      try {
        const jobIds = this.jobs.map((j) => String(j.id))
        if (jobIds.length === 0) {
          this.applications = []
          return
        }
        const res = await applicationsApi.getAll()
        this.applications = res.data.filter((a) => jobIds.includes(String(a.job_id)))
      } catch (err) {
        console.error('Failed to fetch applications:', err)
      }
    },

    async postJob(payload) {
      const user = this._getCurrentUser()
      if (!user?.id) throw new Error('Not authenticated')
      this.loading = true
      try {
        const { skills, ...jobPayload } = payload
        const jobData = {
          ...jobPayload,
          employer_id: String(user.id),
          status: 'pending',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
        const res = await jobsApi.create(jobData)
        const newJob = res.data

        // Handle skills (save to job_skills)
        if (skills && skills.length) {
          await Promise.all(
            skills.map((skillId) =>
              jobSkillsApi.create({
                job_id: newJob.id,
                skill_id: skillId,
              }),
            ),
          )
        }

        this.jobs.unshift(newJob)
        return newJob
      } catch (err) {
        console.error('Failed to post job:', err)
        throw err
      } finally {
        this.loading = false
      }
    },

    async updateJob(id, payload) {
      this.loading = true
      try {
        const { skills, ...jobPayload } = payload
        const updated = { ...jobPayload, updated_at: new Date().toISOString() }
        const res = await jobsApi.update(id, updated)
        const newJob = res.data

        // Sync skills
        if (skills !== undefined) {
          const currentSkillsRes = await jobSkillsApi.getByJob(id)
          const currentSkills = currentSkillsRes.data
          const currentSkillIds = currentSkills.map((s) => String(s.skill_id))
          const newSkillIds = skills.map((s) => String(s))

          // Skills to delete
          const toDelete = currentSkills.filter((s) => !newSkillIds.includes(String(s.skill_id)))
          // Skills to add
          const toAdd = newSkillIds.filter((id) => !currentSkillIds.includes(id))

          await Promise.all([
            ...toDelete.map((s) => jobSkillsApi.delete(s.id)),
            ...toAdd.map((skillId) => jobSkillsApi.create({ job_id: id, skill_id: skillId })),
          ])
        }

        const idx = this.jobs.findIndex((j) => String(j.id) === String(id))
        if (idx !== -1) this.jobs[idx] = newJob
        return newJob
      } catch (err) {
        console.error('Failed to update job:', err)
        throw err
      } finally {
        this.loading = false
      }
    },

    async deleteJob(id) {
      this.loading = true
      try {
        await jobsApi.delete(id)
        this.jobs = this.jobs.filter((j) => String(j.id) !== String(id))
        // remove associated applications from local state
        this.applications = this.applications.filter((a) => String(a.job_id) !== String(id))
      } catch (err) {
        console.error('Failed to delete job:', err)
        throw err
      } finally {
        this.loading = false
      }
    },

    async toggleJobStatus(job) {
      const newStatus = job.status === 'active' ? 'closed' : 'active'
      return await this.updateJob(job.id, { ...job, status: newStatus })
    },

    async updateApplicationStatus(appId, status) {
      try {
        const res = await applicationsApi.updateStatus(appId, status)
        const idx = this.applications.findIndex((a) => String(a.id) === String(appId))
        if (idx !== -1) this.applications[idx] = { ...this.applications[idx], status }
        return res.data
      } catch (err) {
        console.error('Failed to update application status:', err)
        throw err
      }
    },

    getApplicationsForJob(jobId) {
      return this.applications.filter((a) => String(a.job_id) === String(jobId))
    },

    getJobById(id) {
      return this.jobs.find((j) => String(j.id) === String(id)) || null
    },

    async fetchApplicationDetails(appId) {
      this.loading = true
      try {
        const appRes = await applicationsApi.getById(appId)
        const application = appRes.data

        // 1. Fetch User Record (Reliable source for name/email)
        const userRes = await usersApi.getById(application.candidate_id).catch(() => ({ data: null }))
        const user = userRes.data

        // 2. Fetch Candidate Profile (For bio, location, education, etc.)
        // Try searching by user_id first
        let candidateProfileRes = await candidatesApi.getByUser(application.candidate_id).catch(() => ({ data: [] }))
        let candidateProfile = candidateProfileRes.data?.[0] || null

        // If not found, try searching by candidate record ID (fallback)
        if (!candidateProfile) {
          candidateProfileRes = await candidatesApi.getById(application.candidate_id).catch(() => ({ data: null }))
          candidateProfile = candidateProfileRes.data
        }

        // 3. Merge User info into candidate object
        const candidate = {
          ...candidateProfile,
          name: user?.name || candidateProfile?.name || 'Unknown Candidate',
          email: user?.email || candidateProfile?.email || 'N/A',
          phone: user?.phone || candidateProfile?.phone || '',
        }

        // 4. Fetch related data using the candidate record ID if available, otherwise user ID
        const targetCandidateId = candidateProfile?.id || application.candidate_id
        const [eduRes, expRes, skillRes] = await Promise.all([
          candidateEducationApi.getByCandidate(targetCandidateId).catch(() => ({ data: [] })),
          candidateExperienceApi.getByCandidate(targetCandidateId).catch(() => ({ data: [] })),
          candidateSkillsApi.getByCandidate(targetCandidateId).catch(() => ({ data: [] })),
        ])

        return {
          application,
          candidate,
          education: eduRes.data,
          experience: expRes.data,
          skills: skillRes.data,
        }
      } catch (err) {
        console.error('Failed to fetch application details:', err)
        throw err
      } finally {
        this.loading = false
      }
    },
  },
})
