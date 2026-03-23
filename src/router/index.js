import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // --- 1. Public Routes ---
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

    // --- 5. Apply Route ---
    {
      path: '/apply/:id',
      name: 'jobs.apply',
      component: () => import('@/features/jobs/views/ApplyView.vue'),
      meta: { requiresAuth: true },
    },

    // --- 6. 404 Route ---
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue'),
    },
  ],
})

// --- 🛡️ Navigation Guard (The Complete & Modern Way) ---
router.beforeEach((to) => {
  const token = localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user'))

  // 1. لو مسجل دخول وبيحاول يفتح صفحة الهوم أو صفحات الـ Auth (Login/Register)
  // بنرجعه فوراً للدشبورد بتاعته على حسب الـ Role
  if (token && (to.name === 'home' || to.meta.guestOnly)) {
    return { name: `${user.role}.dashboard` }
  }

  // 2. لو الصفحة محتاجة تسجيل دخول واليوزر مش معاه Token
  if (to.meta.requiresAuth && !token) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  // 3. حماية الروتس بناءً على الـ Role (عشان Candidate ميسرقش روت Employer)
  if (to.meta.role && user && to.meta.role !== user.role) {
    return { name: `${user.role}.dashboard` }
  }

  return true // كمل طريقك يا بطل
})

export default router
