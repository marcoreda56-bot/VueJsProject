import axios from 'axios'

// Create Axios instance
const api = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor for auth token (future use)
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem('token')
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`
//   }
//   return config
// })

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message)
    return Promise.reject(error)
  },
)

// Users
export const usersApi = {
  getAll: () => api.get('/users'),
  getById: (id) => api.get(`/users/${id}`),
  create: (data) => api.post('/users', data),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
  getCandidates: () => api.get('/users?role=candidate'),
  getEmployers: () => api.get('/users?role=employer'),
  getAdmins: () => api.get('/users?role=admin'),
}

// Candidates (separate table)
export const candidatesApi = {
  getAll: () => api.get('/candidates'),
  getById: (id) => api.get(`/candidates/${id}`),
  create: (data) => api.post('/candidates', data),
  update: (id, data) => api.put(`/candidates/${id}`, data),
  delete: (id) => api.delete(`/candidates/${id}`),
}

// Employers
export const employersApi = {
  getAll: () => api.get('/employers'),
  getById: (id) => api.get(`/employers/${id}`),
  create: (data) => api.post('/employers', data),
  update: (id, data) => api.put(`/employers/${id}`, data),
  delete: (id) => api.delete(`/employers/${id}`),
}

// Jobs - Primary resource
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

// Categories
export const categoriesApi = {
  getAll: () => api.get('/categories'),
  getById: (id) => api.get(`/categories/${id}`),
  getActive: () => api.get('/categories?is_active=true'),
}

// Applications
export const applicationsApi = {
  getAll: () => api.get('/applications'),
  getById: (id) => api.get(`/applications/${id}`),
  getByJob: (jobId) => api.get(`/applications?job_id=${jobId}`),
  getByCandidate: (candidateId) => api.get(`/applications?candidate_id=${candidateId}`),
  create: (data) => api.post('/applications', data),
  updateStatus: (id, status) => api.patch(`/applications/${id}`, { status }),
}

// Skills & Relations
export const skillsApi = {
  getAll: () => api.get('/skills'),
}

export const candidateSkillsApi = {
  getByCandidate: (candidateId) => api.get(`/candidate_skills?candidate_id=${candidateId}`),
}

export const jobSkillsApi = {
  getByJob: (jobId) => api.get(`/job_skills?job_id=${jobId}`),
}

// Utility
export default api
