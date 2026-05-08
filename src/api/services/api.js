import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => {
    // بناءً على الـ Postman، البيانات تأتي دائماً داخل response.data.data
    return response.data?.success ? response.data.data : response.data
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  },
)

export const authApi = {
  login: (credentials) => api.post('auth/login', credentials),
  register: (data) => api.post('auth/register', data),
  logout: () => api.post('auth/logout'),
  me: () => api.get('/auth/me'),
}

export const publicApi = {
  // --- US2: Categories & Skills ---
  getCategories: () => api.get('/categories'),
  getCategoryBySlug: (slug) => api.get(`/categories/${slug}`),
  getSkills: (categoryId = null) => api.get('/skills', { params: { category_id: categoryId } }),
  getSkillsAutocomplete: (query) => api.get('/skills/autocomplete', { params: { q: query } }),

  // Jobs & Employers
  getJobs: (params) => api.get('/jobs', { params }),
  getJobBySlug: (slug) => api.get(`/jobs/${slug}`),
  getEmployers: (params) => api.get('/employers', { params }),
  getEmployerBySlug: (slug) => api.get(`/employers/${slug}`),
}

export const candidateApi = {
  getProfile: () => api.get('/candidate/profile'),
  updateProfile: (data) => api.put('/candidate/profile', data),

  // Skills & Experience (US3.9 - 3.11)
  addSkills: (data) => api.post('/candidate/skills', data),
  deleteSkill: (skillId) => api.delete(`/candidate/skills/${skillId}`),
  addExperience: (data) => api.post('/candidate/experience', data),
  deleteExperience: (id) => api.delete(`/candidate/experience/${id}`),

  // Resumes
  uploadResume: (formData) =>
    api.post('/candidate/resumes', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  getResumes: () => api.get('/candidate/resumes'),
  setResumeDefault: (id) => api.patch(`/candidate/resumes/${id}/default`),
  deleteResume: (id) => api.delete(`/candidate/resumes/${id}`),

  // Applications
  getApplications: () => api.get('/candidate/applications'),
  applyForJob: (data) => api.post('/candidate/applications', data),
  withdrawApplication: (id) => api.patch(`/candidate/applications/${id}/withdraw`),
  getSavedJobs: () => api.get('/candidate/saved-jobs'),
  toggleSaveJob: (jobId) => api.post('/candidate/saved-jobs', { job_id: jobId }),
}

export const employerApi = {
  getProfile: () => api.get('/employer/profile'),
  updateProfile: (data) => api.put('/employer/profile', data),
  getJobs: () => api.get('/employer/jobs'),
  createJob: (data) => api.post('/employer/jobs', data),
  getJobDetails: (id) => api.get(`/employer/jobs/${id}`), // Added
  updateJob: (id, data) => api.put(`/employer/jobs/${id}`, data),
  updateJobStatus: (id, status) => api.patch(`/employer/jobs/${id}/status`, { status }), // Added
  deleteJob: (id) => api.delete(`/employer/jobs/${id}`),
  getApplications: (params) => api.get('/employer/applications', { params }),
  updateAppStatus: (id, statusData) => api.patch(`/employer/applications/${id}/status`, statusData),
  scheduleInterview: (appId, data) => api.post(`/employer/applications/${appId}/interviews`, data),
}

export const adminApi = {
  // --- US2: Admin Taxonomy Control ---
  // Categories
  createCategory: (data) => api.post('/admin/categories', data),
  updateCategory: (id, data) => api.put(`/admin/categories/${id}`, data),
  deleteCategory: (id) => api.delete(`/admin/categories/${id}`),

  // Skills
  createSkill: (data) => api.post('/admin/skills', data),
  updateSkill: (id, data) => api.put(`/admin/skills/${id}`, data),
  deleteSkill: (id) => api.delete(`/admin/skills/${id}`),

  // General Admin Tasks
  getStats: () => api.get('/admin/dashboard'),
  getUsers: (params) => api.get('/admin/users', { params }),
  updateUserStatus: (id, status) => api.patch(`/admin/users/${id}/status`, { status }),
  getPendingJobs: () => api.get('/admin/jobs?status=pending'),
  approveJob: (id) => api.patch(`/admin/jobs/${id}/status`, { status: 'active' }),
  getPendingReviews: () => api.get('/admin/reviews'),
  approveReview: (id) => api.patch(`/admin/reviews/${id}/approve`),
}

export const notificationsApi = {
  getAll: () => api.get('/notifications'),
  markRead: (id) => api.patch(`/notifications/${id}/read`),
  getUnreadCount: () => api.get('/notifications/unread-count'),
}

export default api
