import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  actions: {
    showSuccess(title, message) {
      alert(`${title}: ${message}`)
    },
    showError(title, message) {
      alert(`${title}: ${message}`)
    },
  },
})
