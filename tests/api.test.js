import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'
import { jobsApi, categoriesApi, usersApi } from '../src/api/api.js'

// Mock axios
vi.mock('axios')

describe('API Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('jobsApi', () => {
    it('should fetch active jobs', async () => {
      const mockJobs = [
        { id: 1, title: 'Senior Frontend Developer', status: 'active' },
        { id: 2, title: 'Backend Developer', status: 'active' },
      ]
      axios.get.mockResolvedValue({ data: mockJobs })

      const response = await jobsApi.getActive()

      expect(axios.get).toHaveBeenCalledWith('/jobs?status=active')
      expect(response.data).toEqual(mockJobs)
    })

    it('should fetch job by ID', async () => {
      const mockJob = { id: 1, title: 'Test Job' }
      axios.get.mockResolvedValue({ data: mockJob })

      const response = await jobsApi.getById(1)

      expect(axios.get).toHaveBeenCalledWith('/jobs/1')
      expect(response.data).toEqual(mockJob)
    })

    it('should create a new job', async () => {
      const newJob = { title: 'New Job', description: 'Test' }
      const mockResponse = { data: { id: 999, ...newJob } }
      axios.post.mockResolvedValue(mockResponse)

      const response = await jobsApi.create(newJob)

      expect(axios.post).toHaveBeenCalledWith('/jobs', newJob)
      expect(response.data.id).toBe(999)
    })
  })

  describe('categoriesApi', () => {
    it('should fetch active categories', async () => {
      const mockCategories = [{ id: 1, name: 'Software Development', is_active: true }]
      axios.get.mockResolvedValue({ data: mockCategories })

      const response = await categoriesApi.getActive()

      expect(axios.get).toHaveBeenCalledWith('/categories?is_active=true')
      expect(response.data).toEqual(mockCategories)
    })
  })

  describe('usersApi', () => {
    it('should fetch candidates (users with role=candidate)', async () => {
      const mockCandidates = [{ id: 1, role: 'candidate', name: 'John Doe' }]
      axios.get.mockResolvedValue({ data: mockCandidates })

      const response = await usersApi.getCandidates()

      expect(axios.get).toHaveBeenCalledWith('/users?role=candidate')
      expect(response.data).toEqual(mockCandidates)
    })
  })

  describe('Error Handling', () => {
    it('should handle API errors gracefully', async () => {
      const error = { response: { data: { message: 'Not found' } } }
      axios.get.mockRejectedValue(error)

      // Suppress console.error for test
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      await expect(jobsApi.getAll()).rejects.toThrow()

      expect(consoleSpy).toHaveBeenCalled()
      consoleSpy.mockRestore()
    })
  })
})
