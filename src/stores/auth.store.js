import { defineStore } from 'pinia'
import axios from 'axios'

const API_URL = 'http://localhost:3000'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
  }),

  actions: {
    // 1. دالة تسجيل يوزر جديد (بدون ID يدوي)
    async register(userData) {
      try {
        // 👈 بنفك الـ userData وبناخد الحقول الصافية بس
        // كدة بنضمن إن لو فيه "id" في الفورم بالصدفة، مش هيدخل في الـ payload
        const { name, email, password, role, company_name } = userData

        const payload = {
          name,
          email,
          password,
          role: role || 'candidate', // لو مش مبعوت يخليها كانديدات
          company_name: company_name || '',
          created_at: new Date().toISOString(),
        }

        // السيرفر دلوقتي هيستلم داتا "صافية" من غير ID
        // وهيحط رقم 18 (لو أنت شلت علامات التنصيص من الـ 17 في الـ db.json)
        const res = await axios.post(`${API_URL}/users`, payload)

        if (res.data) {
          const fakeToken = 'Bearer_' + btoa(res.data.email)
          this.setUser(res.data, fakeToken)
          return res.data
        }
      } catch (err) {
        console.error('Register Error:', err)
        throw err
      }
    },

    async login(email, password) {
      try {
        const res = await axios.get(`${API_URL}/users?email=${email}&password=${password}`)

        if (res.data && res.data.length > 0) {
          const userData = res.data[0]
          const fakeToken = 'Bearer_' + btoa(userData.email)

          this.setUser(userData, fakeToken)
          return userData
        } else {
          throw new Error('بيانات الدخول غير صحيحة')
        }
      } catch (err) {
        console.error('Login Error:', err)
        throw err
      }
    },

    setUser(userData, token) {
      this.user = userData
      this.token = token
      localStorage.setItem('user', JSON.stringify(userData))
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
