import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { adminApi, publicApi } from '@/api/services/api'
import Swal from 'sweetalert2'
export const useAdminStore = defineStore('admin', () => {
  const users = ref([])
  const jobs = ref([])
  const categories = ref([])
  const skills = ref([])
  const loading = ref(false)
  const error = ref(null)
  const pagination = ref({ users: {}, jobs: {} })

  const stats = computed(() => ({
    totalUsers: users.value.length,
    totalJobs: jobs.value.length,
    pendingJobs: jobs.value.filter((j) => j.status === 'pending').length,
    totalCategories: categories.value.length,
  }))

  // stores/AdminStore.js

  const fetchAdminJobs = async (status = '') => {
    loading.value = true
    error.value = null
    try {
      const params = {}
      if (status) params.status = status
      const res = await adminApi.getAdminJobs(params)
      if (res && res.data) {
        jobs.value = res.data
        pagination.value.jobs = res.meta
      } else {
        jobs.value = res
      }

      console.log('Jobs loaded count:', jobs.value.length)
    } catch (err) {
      error.value = 'Failed to load moderation queue'
      console.error(err)
    } finally {
      loading.value = false
    }
  }
  const fetchAllData = async (forceRefresh = false) => {
    if (!forceRefresh && categories.value.length > 0) return

    loading.value = true
    error.value = null

    try {
      const results = await Promise.allSettled([adminApi.getUsers(), publicApi.getCategories()])

      if (results[0] && results[0].status === 'fulfilled') {
        const uRes = results[0].value
        users.value = uRes?.data || uRes || []
      }

      if (results[1] && results[1].status === 'fulfilled') {
        const catRes = results[1].value
        categories.value = catRes?.data || catRes || []
      }

      console.log('Data loaded safely')
    } catch (err) {
      error.value = err.message
      console.error('General Fetch error:', err)
    } finally {
      loading.value = false
    }
  }
  const addCategory = async (data) => {
    const res = await adminApi.createCategory(data)
    const newCat = res.data || res
    categories.value.push(newCat)
    return newCat
  }

  const approveJob = async (id) => {
    try {
      await adminApi.updateJobStatus(id, { status: 'active' })
      const index = jobs.value.findIndex((j) => j.id === id)
      if (index !== -1) jobs.value[index].status = 'active'
    } catch (err) {
      console.error('Approve Error:', err)
    }
  }

  const rejectJob = async (id, reasonText) => {
    try {
      await adminApi.rejectJob(id, reasonText)

      const index = jobs.value.findIndex((j) => j.id === id)
      if (index !== -1) {
        jobs.value[index].status = 'rejected'
      }

      Swal.fire('Success', 'Job rejected.', 'success')
    } catch (err) {
      if (err.response?.status === 422) {
        console.error('Validation Errors:', err.response.data.errors)
        Swal.fire('Error', 'Please provide a valid rejection reason.', 'error')
      }
    }
  }

  const deleteJob = async (id) => {
    try {
      const response = await adminApi.deleteJob(id)

      jobs.value = jobs.value.filter((j) => j.id !== id)

      await Swal.fire({
        title: 'Deleted!',
        text: 'Job removed successfully.',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
      })
    } catch (err) {
      console.error('Caught Delete Error:', err)

      const errorMessage = err.response?.data?.message || err.message || 'Server Error'

      await Swal.fire({
        title: 'Database Restriction',
        html: `
        <div style="text-align: left; background: #fff5f5; padding: 15px; border-radius: 10px; border: 1px solid #fed7d7;">
          <strong style="color: #c53030;">Reason:</strong>
          <p style="color: #742a2a; font-size: 0.85rem; margin-top: 5px;">${errorMessage}</p>
          <hr style="margin: 10px 0; border: 0; border-top: 1px solid #feb2b2;">
          <p style="font-size: 0.8rem; color: #4a5568;">
            <b>Hint:</b> This job has linked data (skills or applications). 
            Laravel cannot perform a <code>forceDelete</code> while these links exist.
          </p>
        </div>
      `,
        icon: 'error',
        confirmButtonText: 'I Understand',
        confirmButtonColor: '#4f46e5',
      })
    }
  }
  const updateCategory = async (id, data) => {
    const res = await adminApi.updateCategory(id, data)
    const updated = res.data || res
    const index = categories.value.findIndex((c) => c.id === id)
    if (index !== -1) categories.value[index] = updated
  }

  const deleteCategory = async (id) => {
    await adminApi.deleteCategory(id)
    categories.value = categories.value.filter((c) => c.id !== id)
  }

  const fetchSkills = async (categoryId = null) => {
    loading.value = true
    try {
      const res = await publicApi.getSkills(categoryId)
      skills.value = res.data || res
    } catch (err) {
      console.error('Error fetching skills:', err)
    } finally {
      loading.value = false
    }
  }

  const fetchUsers = async (page = 1, role = '') => {
    loading.value = true
    try {
      const res = await adminApi.getUsers({ page, role })
      users.value = res.data.data
      pagination.value.users = res.data.meta
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  const addSkill = async (skillData) => {
    loading.value = true
    try {
      const res = await adminApi.createSkill(skillData)

      console.log('API Response for Skill:', res)

      const newSkill = res?.data ? res.data : res

      if (newSkill && newSkill.id) {
        skills.value.push(newSkill)
        return newSkill
      } else {
        throw new Error('Invalid skill data received from server')
      }
    } catch (err) {
      console.error('Add Skill Error:', err.response?.data || err.message)
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteSkill = async (id) => {
    await adminApi.deleteSkill(id)
    skills.value = skills.value.filter((s) => s.id !== id)
  }

  return {
    users,
    jobs,
    categories,
    skills,
    loading,
    error,
    stats,
    fetchAllData,
    addCategory,
    updateCategory,
    deleteCategory,
    fetchSkills,
    addSkill,
    deleteSkill,
    approveJob,
    rejectJob,
    deleteJob,
    fetchUsers,
    fetchAdminJobs,
  }
})
