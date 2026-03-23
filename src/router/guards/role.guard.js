import { useAuthStore } from '@/stores/auth.store'

export function roleGuard(to, from, next) {
  const auth = useAuthStore()
  if (to.meta.role && auth.userRole !== to.meta.role) return next({ name: 'home' })
  next()
}
