import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/AuthStore'

const routes = [
  // --- Public Routes ---
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/auth/LoginView.vue'),
    meta: { guest: true },
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/auth/RegisterView.vue'),
    meta: { guest: true },
  },
  {
    path: '/jobs',
    name: 'jobs',
    component: () => import('@/views/jobs/JobListView.vue'),
  },
  {
    path: '/jobs/:slug',
    name: 'job-details',
    component: () => import('@/views/jobs/JobDetailView.vue'),
  },

  {
    path: '/candidate',
    component: () => import('@/layouts/CandidateLayout.vue'),
    meta: { requiresAuth: true, role: 'candidate' },
    children: [
      {
        path: 'dashboard',
        name: 'candidate-dashboard',
        component: () => import('@/views/candidate/DashboardView.vue'),
      },
      {
        path: 'profile',
        name: 'candidate-profile',
        component: () => import('@/views/candidate/ProfileView.vue'),
      },
      {
        path: 'applications',
        name: 'candidate-applications',
        component: () => import('@/views/candidate/DashboardView.vue'),
      },
    ],
  },

  // --- Employer Routes ---
  {
    path: '/employer',
    component: () => import('@/layouts/EmployerLayout.vue'),
    meta: { requiresAuth: true, role: 'employer' },
    children: [
      {
        path: 'dashboard',
        name: 'employer-dashboard',
        component: () => import('@/views/employer/DashboardView.vue'),
      },
      {
        path: 'post-job',
        name: 'job-create',
        component: () => import('@/views/employer/PostJobView.vue'),
      },
      {
        path: 'edit-job/:id',
        name: 'job-edit',
        component: () => import('@/views/employer/EditJobView.vue'),
      },
      // داخل router/index.js في قسم الـ employer
      {
        path: 'manage-jobs',
        name: 'employer-manage-jobs',
        component: () => import('@/views/employer/ManageJobsView.vue'), // خليها ManageJobsView
      },
      {
        path: 'applications',
        name: 'employer-applications',
        component: () => import('@/views/employer/ApplicationsView.vue'),
      },
    ],
  },

  {
    path: '/admin',
    component: () => import('@/layouts/AdminLayout.vue'),
    meta: { requiresAuth: true, role: 'admin' },
    children: [
      {
        path: 'dashboard',
        name: 'admin-dashboard',
        component: () => import('@/views/admin/DashboardView.vue'),
      },
      {
        path: 'management/taxonomy',
        name: 'admin-taxonomy',
        component: () => import('@/views/admin/TaxonomyView.vue'),
      },
      {
        path: 'management/users',
        name: 'admin-users',
        component: () => import('@/views/admin/UsersView.vue'),
      },
      {
        path: 'management/jobs',
        name: 'admin-jobs',
        component: () => import('@/views/admin/JobsModerationView.vue'),
      },
    ],
  },

  // --- 404 Route ---
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFoundView.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  // Add scroll behavior for better UX
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { top: 0 }
  },
})

// Navigation Guard
router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore()

  // 1. Check if route requires authentication
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return next({ name: 'login' })
  }

  // 2. Prevent authenticated users from visiting guest pages (Login/Register)
  if (to.meta.guest && auth.isAuthenticated) {
    // Redirect based on role instead of just home
    if (auth.userRole === 'admin') return next({ name: 'admin-dashboard' })
    if (auth.userRole === 'employer') return next({ name: 'employer-dashboard' })
    return next({ name: 'candidate-dashboard' })
  }

  // 3. Check Role Authorization
  if (to.meta.role && auth.userRole !== to.meta.role) {
    return next({ name: 'home' })
  }

  next()
})

export default router
