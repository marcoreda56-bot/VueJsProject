import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // 1. Public Routes
    { path: '/', name: 'home', component: () => import('../views/HomeView.vue') },
    { path: '/about', name: 'about', component: () => import('../views/AboutView.vue') },
    {
      path: '/jobs',
      name: 'public.jobs',
      component: () => import('@/features/jobs/views/JobListView.vue'),
    },

    // 2. Auth Routes (Guest Only)
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

    // 3. Candidate Routes
    {
      path: '/candidate',
      component: () => import('@/components/layout/CandidateLayout.vue'),
      meta: { requiresAuth: true, role: 'candidate', hideNavbar: true },
      children: [
        {
          path: 'dashboard',
          name: 'candidate.dashboard',
          component: () => import('@/features/candidate/views/DashboardView.vue'),
        },
        {
          path: 'find-jobs',
          name: 'candidate.find-jobs',
          component: () => import('@/features/jobs/views/JobListView.vue'),
        },
        {
          path: 'jobs/:id',
          name: 'candidate.job-details',
          component: () => import('@/features/jobs/views/JobDetailsView.vue'),
        },
        {
          path: 'jobs/:id/apply',
          name: 'candidate.job-apply',
          component: () => import('@/features/jobs/views/ApplyJob.vue'),
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

    // 4. Employer Routes
    {
      path: '/employer',
      component: () => import('@/components/layout/EmployerLayout.vue'),
      meta: { requiresAuth: true, role: 'employer', hideNavbar: true },
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

    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue'),
    },
  ],
})

// Navigation Guard
router.beforeEach((to) => {
  const token = localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user'))

  if (token && (to.name === 'home' || to.meta.guestOnly)) {
    return { name: `${user.role}.dashboard` }
  }

  if (to.meta.requiresAuth && !token) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  if (to.meta.role && user && to.meta.role !== user.role) {
    return { name: `${user.role}.dashboard` }
  }

  return true
})

export default router
