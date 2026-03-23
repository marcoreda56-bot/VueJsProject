import { createRouter, createWebHistory } from 'vue-router'
import { authGuard } from './guards/auth.guard'
import { roleGuard } from './guards/role.guard'
import { useAuthStore } from '@/stores/auth.store'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // --- 1. Public Routes ---
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: '/jobs',
      name: 'public.jobs',
      component: () => import('@/features/jobs/views/JobListView.vue'),
    },
    {
      path: '/jobs/:id',
      name: 'job.detail',
      component: () => import('../views/JobDetailView.vue'),
    },

    // --- 2. Auth Routes (Guest Only) ---
    {
      path: '/auth',
      component: () => import('@/components/layout/AuthLayout.vue'),
      meta: { guestOnly: true },
      children: [
        {
          path: 'login',
          name: 'login',
          component: () => import('@/features/auth/views/LoginView.vue'),
        },
        {
          path: 'register',
          name: 'register',
          component: () => import('@/features/auth/views/RegisterView.vue'),
        },
      ],
    },

    // --- 3. Candidate Routes ---
    {
      path: '/candidate',
      component: () => import('@/components/layout/CandidateLayout.vue'),
      meta: { requiresAuth: true, role: 'candidate' },
      children: [
        {
          path: 'dashboard',
          name: 'candidate.dashboard',
          component: () => import('@/features/candidate/views/CandidateDashboardView.vue'),
        },
        {
          path: 'profile',
          name: 'candidate.profile',
          component: () => import('@/features/candidate/views/ProfileView.vue'),
        },
        {
          path: 'applications',
          name: 'candidate.applications',
          component: () => import('@/features/candidate/views/MyApplicationsView.vue'),
        },
      ],
    },

    // --- 4. Employer Routes ---
    {
      path: '/employer',
      component: () => import('@/components/layout/EmployerLayout.vue'),
      meta: { requiresAuth: true, role: 'employer' },
      children: [
        {
          path: 'dashboard',
          name: 'employer.dashboard',
          component: () => import('@/features/employer/views/EmployerDashboardView.vue'),
        },
        {
          path: 'post-job',
          name: 'employer.post-job',
          component: () => import('@/features/employer/views/PostJobView.vue'),
        },
        {
          path: 'manage-jobs',
          name: 'employer.manage-jobs',
          component: () => import('@/features/employer/views/ManageJobsView.vue'),
        },
      ],
    },

    // --- 5. Admin Routes ---
    {
      path: '/admin',
      component: () => import('@/components/layout/AdminLayout.vue'),
      meta: { requiresAuth: true, role: 'admin' },
      children: [
        {
          path: 'dashboard',
          name: 'admin.dashboard',
          component: () => import('@/features/admin/views/AdminDashboardView.vue'),
        },
        {
          path: 'users',
          name: 'admin.users',
          component: () => import('@/features/admin/views/ManageUsersView.vue'),
        },
      ],
    },

    {
      path: '/apply/:id',
      name: 'jobs.apply',
      component: () => import('@/features/jobs/views/ApplyView.vue'),
      meta: { requiresAuth: true },
    },

    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue'),
    },
  ],
})

// --- 🔥 التعديل الجوهري هنا ---
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const userStr = localStorage.getItem('user')
  const user = userStr ? JSON.parse(userStr) : null

  // 1. لو اليوزر مسجل دخول وبيحاول يروح للهوم أو صفحات الـ Auth
  if (token && user) {
    if (to.name === 'home' || to.meta.guestOnly) {
      return next({ name: `${user.role}.dashboard` })
    }
  }

  // 2. تشغيل الحراس الأساسيين بتوعك
  authGuard(to, from, () => {
    roleGuard(to, from, next)
  })
})

export default router
