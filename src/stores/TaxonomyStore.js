import { defineStore } from 'pinia'
import { publicApi } from '@/api/services/api'

export const useTaxonomyStore = defineStore('taxonomy', {
  state: () => ({
    categories: [],
    skills: [],
    loading: false,
    error: null,
  }),

  getters: {
    activeCategories: (state) => state.categories.filter((c) => c.is_active),
    getCategoryById: (state) => (id) => state.categories.find((c) => c.id === id),
  },

  actions: {
    async fetchCategories() {
      this.loading = true
      try {
        const data = await publicApi.getCategories()
        this.categories = data
      } catch (err) {
        this.error = 'Failed to load categories'
        console.error(err)
      } finally {
        this.loading = false
      }
    },

    async searchSkills(query) {
      if (!query || query.length < 2) return []
      try {
        return await publicApi.getSkillsAutocomplete(query)
      } catch (err) {
        console.error('Autocomplete error:', err)
        return []
      }
    },
  },
})
