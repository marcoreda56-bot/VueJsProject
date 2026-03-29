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
    {
      path: '/jobs/:id',
      name: 'job.detail',
      component: () => import('@/features/jobs/views/JobDetailsView.vue'),
    },

    // 2. Auth Routes (Guest Only)
    {
      path: '/auth',
      component: () => import('@/components/layout/AuthLayout.vue'),
      meta: { guestOnly: true, hideNavbar: true },
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
        {
          path: 'applications',
          name: 'employer.applications',
          component: () => import('@/features/employer/views/EmployerApplicationsView.vue'),
        },
        {
          path: 'applications/:id',
          name: 'employer.application-details',
          component: () => import('@/features/employer/views/ApplicationDetailsView.vue'),
        },
        {
          path: 'jobs/:id',
          name: 'employer.job-details',
          component: () => import('@/features/jobs/views/JobDetailsView.vue'),
        },
        {
          path: 'edit-job/:id',
          name: 'employer.edit-job',
          component: () => import('@/features/employer/views/EditJobView.vue'),
        },
        {
          path: 'find-jobs',
          name: 'employeer.find-jobs',
          component: () => import('@/features/jobs/views/JobListView.vue'),
        },
      ],
    },

    // 5. Admin Routes
    {
      path: '/admin',
      component: () => import('@/components/layout/AdminLayout.vue'),
      meta: { requiresAuth: true, role: 'admin', hideNavbar: true },
      children: [
        {
          path: 'dashboard',
          name: 'admin.dashboard',
          component: () => import('@/features/admin/views/AdminDashboardView.vue'),
        },
        {
          path: 'management/users',
          name: 'admin.users',
          component: () => import('@/features/admin/views/ManageUsersView.vue'),
        },
        {
          path: 'management/users/:id',
          name: 'admin.user-details',
          component: () => import('@/features/admin/views/AdminUserDetailsView.vue'),
        },
        {
          path: 'management/jobs',
          name: 'admin.jobs',
          component: () => import('@/features/admin/views/ManageJobsView.vue'),
        },
        {
          path: 'management/jobs/:id',
          name: 'admin.job-details',
          component: () => import('@/features/admin/views/AdminJobDetailsView.vue'),
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
  let user = null
  try {
    user = JSON.parse(localStorage.getItem('user'))
  } catch {
    // Corrupted localStorage — clear and redirect to login
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  if (token && user && (to.name === 'home' || to.meta.guestOnly)) {
    return { name: `${user.role}.dashboard` }
  }

  if (to.meta.requiresAuth && (!token || !user)) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  if (to.meta.role && user && to.meta.role !== user.role) {
    return { name: `${user.role}.dashboard` }
  }

  return true
})

export default router
