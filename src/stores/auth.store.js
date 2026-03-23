import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    // هنا السر: بنقرأ من الـ localStorage أول ما الـ store يتكريت
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
    loading: false,
  }),

  getters: {
    // التوكن موجود؟ يبقى مسجل دخول
    isAuthenticated: (state) => !!state.token,
    getUserRole: (state) => state.user?.role,
  },

  actions: {
    setUser(user, token) {
      this.user = user
      this.token = token
      localStorage.setItem('user', JSON.stringify(user))
      localStorage.setItem('token', token)
    },
    logout() {
      this.user = null
      this.token = null
      localStorage.removeItem('user')
      localStorage.removeItem('token')
    },
  },
})
