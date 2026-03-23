import { useAuthStore } from '@/stores/auth.store'

export function authGuard(to, from, next) {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.isAuthenticated) return next({ name: 'login' })
  if (to.meta.guestOnly && auth.isAuthenticated) return next({ name: 'home' })
  next()
}
