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
  forgotPassword: (data) => api.post('auth/forgot-password', data),
  resetPassword: (data) => api.post('auth/reset-password', data),
}

export const publicApi = {
  getCategories: () => api.get('/categories'),
  getCategoryBySlug: (slug) => api.get(`/categories/${slug}`),
  getSkills: (categoryId = null) => api.get('/skills', { params: { category_id: categoryId } }),
  getSkillsAutocomplete: (query) => api.get('/skills/autocomplete', { params: { q: query } }),

  getJobs: (params) => api.get('/jobs', { params }),
  getJobBySlug: (slug) => api.get(`/jobs/${slug}`),
  getEmployers: (params) => api.get('/employers', { params }),
  getEmployerBySlug: (slug) => api.get(`/employers/${slug}`),
  getEmployerReviews: (slug) => api.get(`/employers/${slug}/reviews`),
}

export const candidateApi = {
  getProfile: () => api.get('/candidate/profile'),
  updateProfile: (data) => api.put('/candidate/profile', data),

  // Education
  getEducation: () => api.get('/candidate/education'),
  addEducation: (data) => api.post('/candidate/education', data),
  updateEducation: (id, data) => api.put(`/candidate/education/${id}`, data),
  deleteEducation: (id) => api.delete(`/candidate/education/${id}`),

  // Experience
  addExperience: (data) => api.post('/candidate/experience', data),
  updateExperience: (id, data) => api.put(`/candidate/experience/${id}`, data),
  deleteExperience: (id) => api.delete(`/candidate/experience/${id}`),

  // Skills
  addSkills: (data) => api.post('/candidate/skills', data),
  deleteSkill: (skillId) => api.delete(`/candidate/skills/${skillId}`),

  // Resumes
  uploadResume: (formData) =>
    api.post('/candidate/resumes', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  getResumes: () => api.get('/candidate/resumes'),
  updateResume: (id, data) => api.put(`/candidate/resumes/${id}`, data),
  setResumeDefault: (id) => api.patch(`/candidate/resumes/${id}/default`),
  deleteResume: (id) => api.delete(`/candidate/resumes/${id}`),

  // Applications
  getApplications: (params) => api.get('/candidate/applications', { params }),
  getApplication: (id) => api.get(`/candidate/applications/${id}`),
  applyForJob: (data) => api.post('/candidate/applications', data),
  withdrawApplication: (id, reason) =>
    api.patch(`/candidate/applications/${id}/withdraw`, { reason }),

  // Saved Jobs
  getSavedJobs: () => api.get('/candidate/saved-jobs'),
  saveJob: (jobId, notes = '') => api.post('/candidate/saved-jobs', { job_id: jobId, notes }),
  unsaveJob: (jobId) => api.delete(`/candidate/saved-jobs/${jobId}`),

  // Reviews
  getReviews: () => api.get('/candidate/reviews'),
  submitReview: (data) => api.post('/candidate/reviews', data),
  updateReview: (id, data) => api.put(`/candidate/reviews/${id}`, data),
  deleteReview: (id) => api.delete(`/candidate/reviews/${id}`),
}

export const employerApi = {
  getProfile: () => api.get('/employer/profile'),
  updateProfile: (data) => api.put('/employer/profile', data),

  getJobs: (params) => api.get('/employer/jobs', { params }),
  createJob: (data) => api.post('/employer/jobs', data),
  getJobDetails: (id) => api.get(`/employer/jobs/${id}`),
  updateJob: (id, data) => api.put(`/employer/jobs/${id}`, data),
  updateJobStatus: (id, status) => api.patch(`/employer/jobs/${id}/status`, { status }),
  deleteJob: (id) => api.delete(`/employer/jobs/${id}`),

  getApplications: (params) => api.get('/employer/applications', { params }),
  getJobApplications: (jobId, params) =>
    api.get(`/employer/jobs/${jobId}/applications`, { params }),
  getApplicationDetail: (id) => api.get(`/employer/applications/${id}`),
  updateAppStatus: (id, data) => api.patch(`/employer/applications/${id}/status`, data),

  scheduleInterview: (appId, data) => api.post(`/employer/applications/${appId}/interviews`, data),
  rescheduleInterview: (appId, interviewId, data) =>
    api.patch(`/employer/applications/${appId}/interviews/${interviewId}/reschedule`, data),
  cancelInterview: (appId, interviewId, data) =>
    api.patch(`/employer/applications/${appId}/interviews/${interviewId}/cancel`, data),
  markInterviewOutcome: (appId, interviewId, data) =>
    api.patch(`/employer/applications/${appId}/interviews/${interviewId}/outcome`, data),

  getReviews: () => api.get('/employer/reviews'),
  replyToReview: (id, data) => api.post(`/employer/reviews/${id}/reply`, data),
}

export const adminApi = {
  // --- US2: Admin Taxonomy Control ---
  // Categories
  createCategory: (data) => api.post('/admin/categories', data),
  updateCategory: (id, data) => api.put(`/admin/categories/${id}`, data),
  deleteCategory: (id) => api.delete(`/admin/categories/${id}`),
  getJobs: (params) => api.get('/admin/jobs', { params }),

  confirmJob: (id) => api.patch(`/admin/jobs/${id}/confirm`),
  rejectJob: (id, reason) =>
    api.patch(`/admin/jobs/${id}/reject`, {
      rejection_reason: reason,
    }),
  createSkill: (data) => api.post('/admin/skills', data),
  updateSkill: (id, data) => api.put(`/admin/skills/${id}`, data),
  deleteSkill: (id) => api.delete(`/admin/skills/${id}`),
  updateJobStatus: (id, data) => api.patch(`/admin/jobs/${id}/status`, data),
  deleteJob: (id) => api.delete(`/admin/jobs/${id}`),
  getAdminJobs: (params) => api.get('/admin/jobs', { params }),
  updateJobStatus: (id, data) => api.patch(`/admin/jobs/${id}/status`, data),
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
  markAllRead: () => api.patch('/notifications/read-all'),
  getUnreadCount: () => api.get('/notifications/unread-count'),
}

/**
 * Download a file by its ID as a Blob for inline viewing.
 * Returns a Blob URL that can be opened in a new tab.
 */
export async function downloadFileBlob(fileId) {
  const response = await api.get(`/files/${fileId}/download`, {
    responseType: 'blob',
  })
  return URL.createObjectURL(response)
}

/**
 * Download a resume file (attached to an application) as a Blob for inline viewing.
 * Returns a Blob URL that can be opened in a new tab.
 */
export async function downloadResumeBlob(applicationId) {
  const response = await api.get(`/applications/${applicationId}/resume`, {
    responseType: 'blob',
  })
  return URL.createObjectURL(response)
}

// Helper: Ensure a file URL is usable by the frontend.
// The backend stores paths like /storage/avatar/uuid.jpg.
// Vite's dev-server proxy forwards /storage/* to the Laravel backend
// (port 8000) which serves files from storage/app/private via the
// built-in storage/{path} route. In production, /storage is served by
// the web server (e.g. Nginx) or Laravel itself.
export function getFileUrl(path) {
  if (!path) return ''
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('file://'))
    return path

  // Ensure the path starts with a leading slash so the browser
  // resolves it from the domain root (e.g. http://localhost:3001/)
  return path.startsWith('/') ? path : `/${path}`
}

export default api
