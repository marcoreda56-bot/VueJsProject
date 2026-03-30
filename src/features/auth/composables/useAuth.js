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
    isLoading.value = true
    error.value = null
    try {
      const response = await api.get(`/users?email=${email}`)
      const user = response.data?.[0]

      if (user && user.password === password) {
        auth.setUser(user, 'mock-jwt-token-123')
        router.push({ name: `${user.role}.dashboard` })
      } else {
        error.value = 'error in email or password'
      }
    } catch {
      error.value = 'server error connection'
    } finally {
      isLoading.value = false
    }
  }

  const register = async (userData, role) => {
    isLoading.value = true
    error.value = null

    try {
      const checkRes = await api.get(`/users?email=${userData.email}`)

      if (checkRes.data.length > 0) {
        error.value = 'email already exist'
        return false
      }

      const userRes = await api.post('/users', {
        ...userData,
        role: role,
        created_at: new Date().toISOString(),
      })

      const newUser = userRes.data

      if (newUser && role === 'candidate') {
        await api.post('/candidates', {
          id: newUser.id,
          user_id: newUser.id,
          title: '',
          location: 'Egypt',
          bio: '',
          skills: [],
        })
      } else if (newUser && role === 'employer') {
        await api.post('/employers', {
          id: newUser.id,
          user_id: newUser.id,
          company_name: userData.company_name || '',
          location: 'Egypt',
          bio: '',
        })
      }

      auth.setUser(newUser, 'mock-jwt-token-123')
      router.push({ name: `${role}.dashboard` })
      return true
    } catch (err) {
      console.error('Register Error:', err)
      error.value = 'error in registeration'
      return false
    } finally {
      isLoading.value = false
    }
  }
  return { login, register, isLoading, error }
}
