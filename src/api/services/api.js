import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 10000,
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
  (response) => response,
  (error) => {
    console.error('HireMasr API Error:', error.response?.data || error.message)
    return Promise.reject(error)
  },
)

export const usersApi = {
  login: (email, password) => api.get(`/users?email=${email}&password=${password}`),
  register: (data) => api.post('/users', data),
  getAll: () => api.get('/users'),
  getById: (id) => api.get(`/users/${id}`),
  update: (id, data) => api.patch(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
  getByRole: (role) => api.get(`/users?role=${role}`),
  getCandidates: () => api.get('/users?role=candidate'),
  getEmployers: () => api.get('/users?role=employer'),
  getAdmins: () => api.get('/users?role=admin'),
}

export const candidatesApi = {
  getAll: () => api.get('/candidates'),
  getById: (id) => api.get(`/candidates/${id}`),
  create: (data) => api.post('/candidates', data),
  update: (id, data) => api.patch(`/candidates/${id}`, data),
  delete: (id) => api.delete(`/candidates/${id}`),
  getByUser: (userId) => api.get(`/candidates?user_id=${userId}`),
}

export const candidateEducationApi = {
  getByCandidate: (candidateId) => api.get(`/candidate_education?candidate_id=${candidateId}`),
  create: (data) => api.post('/candidate_education', data),
  update: (id, data) => api.patch(`/candidate_education/${id}`, data),
  delete: (id) => api.delete(`/candidate_education/${id}`),
}

export const candidateExperienceApi = {
  getByCandidate: (candidateId) => api.get(`/candidate_experiences?candidate_id=${candidateId}`),
  create: (data) => api.post('/candidate_experiences', data),
  update: (id, data) => api.patch(`/candidate_experiences/${id}`, data),
  delete: (id) => api.delete(`/candidate_experiences/${id}`),
}

export const employersApi = {
  getAll: () => api.get('/employers'),
  getById: (id) => api.get(`/employers/${id}`),
  create: (data) => api.post('/employers', data),
  update: (id, data) => api.put(`/employers/${id}`, data),
  delete: (id) => api.delete(`/employers/${id}`),
  getByUser: (userId) => api.get(`/employers?user_id=${userId}`),
}

export const jobsApi = {
  getAll: () => api.get('/jobs'),
  getById: (id) => api.get(`/jobs/${id}`),
  getActive: () => api.get('/jobs?status=active'),
  getByEmployer: (employerId) => api.get(`/jobs?employer_id=${employerId}`),
  getByCategory: (categoryId) => api.get(`/jobs?category_id=${categoryId}`),
  create: (data) => api.post('/jobs', data),
  update: (id, data) => api.patch(`/jobs/${id}`, data),
  delete: (id) => api.delete(`/jobs/${id}`),
}

export const categoriesApi = {
  getAll: () => api.get('/categories'),
  getById: (id) => api.get(`/categories/${id}`),
  getActive: () => api.get('/categories?is_active=true'),
}

export const applicationsApi = {
  getAll: () => api.get('/applications'),
  getById: (id) => api.get(`/applications/${id}`),
  getByJob: (jobId) => api.get(`/applications?job_id=${jobId}`),
  getByCandidate: (candidateId) => api.get(`/applications?candidate_id=${candidateId}`),
  create: (data) => api.post('/applications', data),
  updateStatus: (id, status) => api.patch(`/applications/${id}`, { status }),
  delete: (id) => api.delete(`/applications/${id}`),
}

export const skillsApi = {
  getAll: () => api.get('/skills'),
  create: (data) => api.post('/skills', data),
}

export const candidateSkillsApi = {
  getByCandidate: (candidateId) => api.get(`/candidate_skills?candidate_id=${candidateId}`),
  create: (data) => api.post('/candidate_skills', data),
  delete: (id) => api.delete(`/candidate_skills/${id}`),
}

export const jobSkillsApi = {
  getByJob: (jobId) => api.get(`/job_skills?job_id=${jobId}`),
  create: (data) => api.post('/job_skills', data),
  delete: (id) => api.delete(`/job_skills/${id}`),
}

export default api
