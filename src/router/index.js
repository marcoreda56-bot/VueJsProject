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
    path: '/about',
    name: 'about',
    component: () => import('@/views/AboutView.vue'),
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
    path: '/auth/forgot-password',
    name: 'forgot-password',
    component: () => import('@/views/auth/ForgotPasswordView.vue'),
    meta: { guest: true },
  },
  {
    path: '/auth/reset-password',
    name: 'reset-password',
    component: () => import('@/views/auth/ResetPasswordView.vue'),
    meta: { guest: true },
  },
  {
    path: '/jobs',
    name: 'jobs',
    component: () => import('@/views/jobs/JobListView.vue'),
  },
  {
    path: '/jobs/:id',
    name: 'job-details',
    component: () => import('@/views/jobs/JobDetailView.vue'),
    props: true,
  },
  {
    path: '/employers',
    name: 'employers',
    component: () => import('@/views/employer/EmployerListView.vue'),
  },
  {
    path: '/employers/:slug',
    name: 'employer-public-profile',
    component: () => import('@/views/employer/EmployerPublicProfileView.vue'),
    props: true,
  },

  // --- Candidate Routes ---
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
        component: () => import('@/views/candidate/ApplicationsView.vue'),
      },
      {
        path: 'applications/:id',
        name: 'candidate-application-detail',
        component: () => import('@/views/candidate/ApplicationDetailView.vue'),
        props: true,
      },
      {
        path: 'saved-jobs',
        name: 'candidate-saved-jobs',
        component: () => import('@/views/candidate/SavedJobsView.vue'),
      },
      {
        path: 'notifications',
        name: 'candidate-notifications',
        component: () => import('@/views/candidate/NotificationsView.vue'),
      },
      {
        path: 'reviews',
        name: 'candidate-reviews',
        component: () => import('@/views/candidate/ReviewsView.vue'),
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
        path: 'jobs/:id',
        name: 'employer-job-detail',
        component: () => import('@/views/employer/JobDetailView.vue'),
        props: true,
      },
      {
        path: 'jobs/:id/edit',
        name: 'job-edit',
        component: () => import('@/views/employer/EditJobView.vue'),
        props: true,
      },
      {
        path: 'jobs/:jobId/applications',
        name: 'employer-job-applications',
        component: () => import('@/views/employer/JobApplicationsView.vue'),
        props: true,
      },
      {
        path: 'manage-jobs',
        name: 'employer-manage-jobs',
        component: () => import('@/views/employer/ManageJobsView.vue'),
      },
      {
        path: 'profile',
        name: 'employer-profile',
        component: () => import('@/views/employer/EmployerProfileView.vue'),
      },
      {
        path: 'applications',
        name: 'employer-applications',
        component: () => import('@/views/employer/ApplicationsView.vue'),
      },
      {
        path: 'applications/:id',
        name: 'employer-application-detail',
        component: () => import('@/views/employer/ApplicationDetailView.vue'),
        props: true,
      },
      {
        path: 'reviews',
        name: 'employer-reviews',
        component: () => import('@/views/employer/ReviewsView.vue'),
      },
      {
        path: 'notifications',
        name: 'employer-notifications',
        component: () => import('@/views/employer/NotificationsView.vue'),
      },
    ],
  },

  // --- Admin Routes ---
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

  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFoundView.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { top: 0, behavior: 'smooth' }
  },
})

// Navigation Guard
router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore()

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return next({ name: 'login', query: { redirect: to.fullPath } })
  }

  if (to.meta.guest && auth.isAuthenticated) {
    const dash =
      auth.userRole === 'admin'
        ? 'admin-dashboard'
        : auth.userRole === 'employer'
          ? 'employer-dashboard'
          : 'candidate-dashboard'
    return next({ name: dash })
  }

  if (to.meta.role && auth.userRole !== to.meta.role) {
    return next({ name: 'home' })
  }

  next()
})

export default router
