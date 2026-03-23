import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import api from '@/api/services/api'

export function useAuth() {
  const router = useRouter()
  const auth = useAuthStore()
  const isLoading = ref(false)
  const error = ref(null)

  // دالة تسجيل الدخول
  async function login(email, password) {
    isLoading.value = true
    error.value = null
    try {
      // بنعمل Search في الـ users اللي في db.json
      const response = await api.get(`/users?email=${email}&password=${password}`)
      const user = response.data[0] // json-server بيرجع Array

      if (user) {
        // لو لقى اليوزر، بنخزنه في الـ Pinia Store والـ LocalStorage
        auth.setUser(user, 'mock-jwt-token-123')

        // التوجيه حسب الـ Role (candidate أو employer)
        router.push({ name: `${user.role}.dashboard` })
      } else {
        error.value = 'Invalid email or password'
      }
    } catch (err) {
      error.value = 'Server error, please try again later'
    } finally {
      isLoading.value = false
    }
  }

  // دالة إنشاء حساب جديد
  async function register(formData, role) {
    isLoading.value = true
    error.value = null
    try {
      // بنضيف الـ role للبيانات قبل ما نبعتها
      const newUser = { ...formData, role, id: Date.now() }
      const response = await api.post('/users', newUser)

      if (response.data) {
        auth.setUser(response.data, 'mock-jwt-token-123')
        return true
      }
    } catch (err) {
      error.value = 'Registration failed'
      return false
    } finally {
      isLoading.value = false
    }
  }

  return { login, register, isLoading, error }
}
