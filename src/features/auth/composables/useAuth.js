import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import api from '@/api/services/api'

export function useAuth() {
  const router = useRouter()
  const auth = useAuthStore()

  const isLoading = ref(false)
  const error = ref(null)

  async function login(email, password) {
    if (!email || !password) {
      error.value = 'Please enter email and password'
      return
    }

    isLoading.value = true
    error.value = null

    try {
      const response = await api.get(`/users?email=${email}&password=${password}`)
      const user = response.data?.[0]

      if (!user) {
        error.value = 'Invalid email or password'
        return
      }

      auth.setUser(user, 'mock-jwt-token-123')

      router.push({ name: `${user.role}.dashboard` })
    } catch (err) {
      console.error(err)
      error.value = 'Server error, please try again later'
    } finally {
      isLoading.value = false
    }
  }

  async function register(formData, role) {
    if (!formData.email || !formData.password) {
      error.value = 'Email and password are required'
      return false
    }

    isLoading.value = true
    error.value = null

    try {
      const checkUser = await api.get(`/users?email=${formData.email}`)
      if (checkUser.data.length > 0) {
        error.value = 'Email already exists'
        return false
      }

      const newUser = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: role,
        company_name: formData.company_name || '',
        created_at: new Date().toISOString(),
      }

      const response = await api.post('/users', newUser)

      if (response.data) {
        auth.setUser(response.data, 'mock-jwt-token-123')
        router.push({ name: `${role}.dashboard` })
        return true
      }
    } catch (err) {
      console.error(err)
      error.value = 'Registration failed'
      return false
    } finally {
      isLoading.value = false
    }
  }

  function logout() {
    auth.logout()
    router.push('/auth/login')
  }

  return { login, register, logout, isLoading, error }
}
