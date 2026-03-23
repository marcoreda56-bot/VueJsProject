import axios from 'axios'

// 1. الأساس: إنشاء الـ Axios Instance مع الإعدادات الاحترافية
const api = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

// 2. المحرك: إضافة التوكن أوتوماتيكياً لكل طلب (Interceptors)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// معالجة الأخطاء بشكل موحد
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('🚀 API Error:', error.response?.data || error.message)
    return Promise.reject(error)
  },
)

/** * 3. الخدمات (Services): كل Model لوحده
 * بنستخدم الـ Export عشان ننادي عليهم في الـ Composables
 */

// --- Users & Auth ---
export const usersApi = {
  login: (email, password) => api.get(`/users?email=${email}&password=${password}`),
  register: (data) => api.post('/users', data),
  getAll: () => api.get('/users'),
  getById: (id) => api.get(`/users/${id}`),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
  getByRole: (role) => api.get(`/users?role=${role}`),
}

// --- Jobs (The Core) ---
export const jobsApi = {
  getAll: () => api.get('/jobs'),
  getById: (id) => api.get(`/jobs/${id}`),
  getActive: () => api.get('/jobs?status=active'),
  getByEmployer: (employerId) => api.get(`/jobs?employer_id=${employerId}`),
  getByCategory: (categoryId) => api.get(`/jobs?category_id=${categoryId}`),
  create: (data) => api.post('/jobs', data),
  update: (id, data) => api.put(`/jobs/${id}`, data),
  delete: (id) => api.delete(`/jobs/${id}`),
}

// --- Candidates & Employers Profiles ---
export const profilesApi = {
  // Candidates
  getCandidates: () => api.get('/candidates'),
  getCandidateById: (id) => api.get(`/candidates/${id}`),
  createCandidate: (data) => api.post('/candidates', data),

  // Employers
  getEmployers: () => api.get('/employers'),
  getEmployerById: (id) => api.get(`/employers/${id}`),
}

// --- Applications (تقديمات الوظائف) ---
export const applicationsApi = {
  getAll: () => api.get('/applications'),
  getById: (id) => api.get(`/applications/${id}`),
  getByJob: (jobId) => api.get(`/applications?job_id=${jobId}`),
  getByCandidate: (candidateId) => api.get(`/applications?candidate_id=${candidateId}`),
  create: (data) => api.post('/applications', data),
  updateStatus: (id, status) => api.patch(`/applications/${id}`, { status }),
}

// --- Categories & Skills ---
export const metaApi = {
  getCategories: () => api.get('/categories'),
  getSkills: () => api.get('/skills'),
  getJobSkills: (jobId) => api.get(`/job_skills?job_id=${jobId}`),
  getCandidateSkills: (candidateId) => api.get(`/candidate_skills?candidate_id=${candidateId}`),
}

// تصدير الـ Instance الأساسي كـ Default
export default api
