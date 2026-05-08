import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { adminApi, publicApi } from '@/api/services/api'

export const useAdminStore = defineStore('admin', () => {
  const users = ref([])
  const jobs = ref([])
  const categories = ref([])
  const skills = ref([])
  const loading = ref(false)
  const error = ref(null)

  const stats = computed(() => ({
    totalUsers: users.value.length,
    totalJobs: jobs.value.length,
    pendingJobs: jobs.value.filter((j) => j.status === 'pending').length,
    totalCategories: categories.value.length,
  }))

  const fetchAllData = async (forceRefresh = false) => {
    if (!forceRefresh && categories.value.length > 0) return

    loading.value = true
    error.value = null

    try {
      const results = await Promise.allSettled([
        adminApi.getUsers(),
        publicApi.getJobs(),
        publicApi.getCategories(),
      ])

      if (results[0].status === 'fulfilled') {
        const uRes = results[0].value
        users.value = uRes.data || uRes
      } else {
        console.warn('Users API not ready yet (404)')
      }

      if (results[1].status === 'fulfilled') {
        const jRes = results[1].value
        jobs.value = jRes.data || jRes
      }

      if (results[2].status === 'fulfilled') {
        const catRes = results[2].value
        categories.value = catRes.data || catRes
      }

      console.log('Taxonomy data loaded successfully')
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
  }
})
