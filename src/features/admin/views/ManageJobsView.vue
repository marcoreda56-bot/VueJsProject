<script setup>
import { ref, computed, reactive } from 'vue'
import { useAdminStore } from '@/stores/admin.store'
import Swal from 'sweetalert2'

const adminStore = useAdminStore()
const statusFilter = ref('all')
const showModal = ref(false)
const actionLoading = ref(null)
const submitLoading = ref(false)

const newJob = reactive({
  title: '',
  employer_id: '',
  category_id: '',
  type: 'full_time',
  workplace_type: 'on_site',
  location: '',
  description: '',
  requirements: '',
  benefits: '',
  salary_min: 0,
  salary_max: 0,
  currency: 'EGP',
  experience_level: 'junior',
  career_level: 'Entry Level',
  vacancies: 1,
  status: 'active'
})

const filteredJobs = computed(() => {
  return adminStore.jobs.filter(job => {
    return statusFilter.value === 'all' || job.status === statusFilter.value
  })
})

const updateJobStatus = async (jobId, status) => {
  const actionLabel = status === 'active' ? 'approve' : status === 'rejected' ? 'reject' : 'close'
  const result = await Swal.fire({
    title: `${actionLabel.charAt(0).toUpperCase() + actionLabel.slice(1)} this job?`,
    text: `This will change the job status to "${status}".`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: status === 'active' ? '#4f46e5' : status === 'rejected' ? '#dc2626' : '#6b7280',
    confirmButtonText: `Yes, ${actionLabel} it`,
  })
  if (!result.isConfirmed) return

  actionLoading.value = `${jobId}-${status}`
  try {
    await adminStore.updateJobStatus(jobId, status)
    Swal.fire({ title: 'Updated!', icon: 'success', timer: 1500, showConfirmButton: false })
  } catch {
    Swal.fire('Error', 'Failed to update job status.', 'error')
  } finally {
    actionLoading.value = null
  }
}

const deleteJob = async (jobId) => {
  const result = await Swal.fire({
    title: 'Delete this job?',
    text: 'This action cannot be undone.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#dc2626',
    confirmButtonText: 'Yes, delete permanently',
  })
  if (!result.isConfirmed) return

  actionLoading.value = `${jobId}-delete`
  try {
    await adminStore.deleteJob(jobId)
    Swal.fire({ title: 'Deleted!', text: 'Job posting has been removed.', icon: 'success', timer: 1500, showConfirmButton: false })
  } catch {
    Swal.fire('Error', 'Failed to delete job.', 'error')
  } finally {
    actionLoading.value = null
  }
}

const formErrors = ref([])

const validateForm = () => {
  const errors = []
  if (!newJob.title || newJob.title.trim().length < 3) {
    errors.push('Job title must be at least 3 characters.')
  }
  if (!newJob.employer_id) {
    errors.push('Please select an employer.')
  }
  if (!newJob.category_id) {
    errors.push('Please select a category.')
  }
  if (!newJob.description || newJob.description.trim().length < 10) {
    errors.push('Description must be at least 10 characters.')
  }
  if (newJob.salary_min < 0 || newJob.salary_max < 0) {
    errors.push('Salary values cannot be negative.')
  }
  if (newJob.salary_min > newJob.salary_max && newJob.salary_max > 0) {
    errors.push('Minimum salary cannot exceed maximum salary.')
  }
  if (newJob.vacancies < 1) {
    errors.push('Vacancies must be at least 1.')
  }
  formErrors.value = errors
  return errors.length === 0
}

const resetForm = () => {
  Object.assign(newJob, {
    title: '',
    employer_id: '',
    category_id: '',
    type: 'full_time',
    workplace_type: 'on_site',
    location: '',
    description: '',
    requirements: '',
    benefits: '',
    salary_min: 0,
    salary_max: 0,
    currency: 'EGP',
    experience_level: 'junior',
    career_level: 'Entry Level',
    vacancies: 1,
    status: 'active'
  })
  formErrors.value = []
}

const submitJob = async () => {
  if (!validateForm()) return

  submitLoading.value = true
  try {
    await adminStore.createJob({ ...newJob })
    showModal.value = false
    resetForm()
    Swal.fire({ title: 'Published!', text: 'Job listing has been created successfully.', icon: 'success', timer: 2000, showConfirmButton: false })
  } catch {
    Swal.fire('Error', 'Failed to create job listing.', 'error')
  } finally {
    submitLoading.value = false
  }
}

const getStatusBadgeClass = (status) => {
  switch (status) {
    case 'active': return 'bg-emerald-100 text-emerald-700'
    case 'pending': return 'bg-amber-100 text-amber-700'
    case 'closed': return 'bg-gray-100 text-gray-700'
    case 'draft': return 'bg-blue-100 text-blue-700'
    case 'rejected': return 'bg-red-100 text-red-700'
    default: return 'bg-gray-100 text-gray-700'
  }
}

const getEmployerName = (employerId) => {
  const employer = adminStore.employers.find(e => String(e.user_id) === String(employerId))
  return employer ? employer.company_name : 'Unknown Employer'
}

const isActionLoading = (jobId, action) => actionLoading.value === `${jobId}-${action}`
</script>

<template>
  <div class="p-10 max-w-[1800px] mx-auto">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
      <div>
        <div class="flex items-center gap-2 mb-2">
          <span class="w-2 h-2 bg-indigo-600 rounded-full"></span>
          <span class="text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em]">Job Moderation</span>
        </div>
        <h1 class="text-4xl font-black text-slate-900 tracking-tighter italic">
          Manage Jobs<span class="text-indigo-600">.</span>
        </h1>
      </div>

      <div class="flex gap-4 items-center">
        <button 
          @click="showModal = true"
          class="px-8 py-3 bg-indigo-600 text-white rounded-2xl font-bold text-sm hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all flex items-center gap-2"
        >
          <i class="pi pi-plus"></i>
          Add New Job
        </button>
        <select 
          v-model="statusFilter"
          class="px-6 py-3 bg-white border border-gray-100 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-bold text-sm shadow-sm"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending Approval</option>
          <option value="active">Active</option>
          <option value="draft">Draft</option>
          <option value="closed">Closed</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>
    </div>

    <!-- Jobs Grid/List -->
    <div class="space-y-6">
      <div v-for="job in filteredJobs" :key="job.id" class="bg-white border border-gray-100 p-8 rounded-[2.5rem] shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all group">
        <div class="flex flex-col lg:flex-row gap-8 items-start">
          <!-- Job Info -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-3 mb-4">
              <span :class="[getStatusBadgeClass(job.status || 'active'), 'text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full']">
                {{ job.status || 'active' }}
              </span>
              <span class="text-xs font-bold text-gray-400">{{ job.type || 'Full Time' }} • {{ job.location || 'Remote' }}</span>
            </div>
            <router-link :to="`/admin/management/jobs/${job.id}`">
              <h2 class="text-2xl font-black text-slate-900 tracking-tight mb-2 group-hover:text-indigo-600 transition-colors cursor-pointer">
                {{ job.title || 'Untitled Job' }}
              </h2>
            </router-link>
            <p class="text-sm font-bold text-indigo-600 mb-4">{{ getEmployerName(job.employer_id) }}</p>
            <p class="text-gray-500 text-sm line-clamp-2 font-medium leading-relaxed">{{ job.description || 'No description provided.' }}</p>
          </div>

          <!-- Actions -->
          <div class="lg:flex lg:flex-col lg:items-end gap-3 w-full lg:w-48 pt-4 lg:pt-0 border-t lg:border-t-0 border-gray-50">
            <template v-if="job.status === 'pending'">
              <button 
                @click="updateJobStatus(job.id, 'active')"
                :disabled="isActionLoading(job.id, 'active')"
                class="w-full px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold text-sm hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <i :class="isActionLoading(job.id, 'active') ? 'pi pi-spin pi-spinner' : 'pi pi-check'"></i>
                Approve
              </button>
              <button 
                @click="updateJobStatus(job.id, 'rejected')"
                :disabled="isActionLoading(job.id, 'rejected')"
                class="w-full px-6 py-3 bg-red-50 text-red-600 rounded-2xl font-bold text-sm hover:bg-red-100 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <i :class="isActionLoading(job.id, 'rejected') ? 'pi pi-spin pi-spinner' : 'pi pi-times'"></i>
                Reject
              </button>
            </template>
            <template v-else>
               <button 
                v-if="job.status === 'active'"
                @click="updateJobStatus(job.id, 'closed')"
                :disabled="isActionLoading(job.id, 'closed')"
                class="w-full px-6 py-3 bg-gray-50 text-gray-600 rounded-2xl font-bold text-sm hover:bg-gray-100 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <i :class="isActionLoading(job.id, 'closed') ? 'pi pi-spin pi-spinner' : 'pi pi-lock'"></i>
                Close Job
              </button>
              <button 
                v-if="job.status === 'rejected' || job.status === 'closed'"
                @click="updateJobStatus(job.id, 'active')"
                :disabled="isActionLoading(job.id, 'active')"
                class="w-full px-6 py-3 bg-emerald-50 text-emerald-600 rounded-2xl font-bold text-sm hover:bg-emerald-100 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <i :class="isActionLoading(job.id, 'active') ? 'pi pi-spin pi-spinner' : 'pi pi-refresh'"></i>
                Re-activate
              </button>
            </template>
            <button 
              @click="deleteJob(job.id)"
              :disabled="isActionLoading(job.id, 'delete')"
              class="w-full px-6 py-3 bg-white border border-red-100 text-red-400 rounded-2xl font-bold text-sm hover:bg-red-50 hover:text-red-600 transition-all flex items-center justify-center gap-2 mt-auto disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <i :class="isActionLoading(job.id, 'delete') ? 'pi pi-spin pi-spinner' : 'pi pi-trash'"></i>
              Delete
            </button>
          </div>
        </div>
      </div>

      <div v-if="filteredJobs.length === 0" class="p-20 text-center bg-white border border-gray-100 rounded-[2.5rem]">
        <div class="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
          <i class="pi pi-briefcase text-3xl"></i>
        </div>
        <p class="text-gray-400 font-bold">No jobs found matching your criteria.</p>
      </div>
    </div>

    <!-- Add Job Modal -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" @click="showModal = false; formErrors = []"></div>
      <div class="bg-white rounded-[3rem] w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl relative z-10 flex flex-col">
        <div class="p-8 border-b border-gray-50 flex items-center justify-between bg-white sticky top-0 z-20">
          <div>
            <h2 class="text-2xl font-black text-slate-900 italic">Post New Job<span class="text-indigo-600">.</span></h2>
            <p class="text-sm font-bold text-gray-400">Fill in the details to create a new job listing.</p>
          </div>
          <button @click="showModal = false; formErrors = []" class="w-12 h-12 rounded-2xl bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-all">
            <i class="pi pi-times"></i>
          </button>
        </div>

        <div class="p-10 overflow-y-auto">
          <!-- Validation errors -->
          <div v-if="formErrors.length > 0" class="mb-6 p-4 bg-red-50 rounded-2xl border border-red-100">
            <p class="text-sm font-black text-red-600 mb-2">Please fix the following errors:</p>
            <ul class="list-disc list-inside space-y-1">
              <li v-for="err in formErrors" :key="err" class="text-sm text-red-500 font-medium">{{ err }}</li>
            </ul>
          </div>

          <form @submit.prevent="submitJob" class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <!-- Basic Info -->
            <div class="space-y-6 md:col-span-2">
              <div class="flex items-center gap-2 mb-4">
                <span class="w-1 h-4 bg-indigo-600 rounded-full"></span>
                <h3 class="font-black text-slate-900 uppercase text-xs tracking-widest">General Information</h3>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-2">
                  <label class="text-xs font-black text-slate-400 uppercase tracking-wider ml-1">Job Title</label>
                  <input v-model="newJob.title" type="text" placeholder="e.g. Senior Frontend Engineer" 
                    class="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all font-bold text-slate-900 placeholder:text-gray-300" />
                </div>
                <div class="space-y-2">
                  <label class="text-xs font-black text-slate-400 uppercase tracking-wider ml-1">Employer</label>
                  <select v-model="newJob.employer_id" 
                    class="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all font-bold text-slate-900">
                    <option value="" disabled>Select Employer</option>
                    <option v-for="emp in adminStore.employers" :key="emp.id" :value="emp.id">{{ emp.company_name }}</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Details -->
            <div class="space-y-6">
              <div class="space-y-2">
                <label class="text-xs font-black text-slate-400 uppercase tracking-wider ml-1">Category</label>
                <select v-model="newJob.category_id" 
                  class="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all font-bold text-slate-900">
                  <option value="" disabled>Select Category</option>
                  <option v-for="cat in adminStore.categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
                </select>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-2">
                  <label class="text-xs font-black text-slate-400 uppercase tracking-wider ml-1">Type</label>
                  <select v-model="newJob.type" class="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all font-bold text-slate-900">
                    <option value="full_time">Full Time</option>
                    <option value="part_time">Part Time</option>
                    <option value="freelance">Freelance</option>
                    <option value="internship">Internship</option>
                  </select>
                </div>
                <div class="space-y-2">
                  <label class="text-xs font-black text-slate-400 uppercase tracking-wider ml-1">Workplace</label>
                  <select v-model="newJob.workplace_type" class="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all font-bold text-slate-900">
                    <option value="on_site">On-Site</option>
                    <option value="remote">Remote</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </div>
              </div>
              <div class="space-y-2">
                <label class="text-xs font-black text-slate-400 uppercase tracking-wider ml-1">Location</label>
                <input v-model="newJob.location" type="text" placeholder="e.g. Cairo, Egypt" 
                  class="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all font-bold text-slate-900 placeholder:text-gray-300" />
              </div>
            </div>

            <!-- Salary & More -->
            <div class="space-y-6">
               <div class="grid grid-cols-2 gap-4">
                <div class="space-y-2">
                  <label class="text-xs font-black text-slate-400 uppercase tracking-wider ml-1">Min Salary</label>
                  <input v-model.number="newJob.salary_min" type="number" min="0"
                    class="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all font-bold text-slate-900" />
                </div>
                <div class="space-y-2">
                  <label class="text-xs font-black text-slate-400 uppercase tracking-wider ml-1">Max Salary</label>
                  <input v-model.number="newJob.salary_max" type="number" min="0"
                    class="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all font-bold text-slate-900" />
                </div>
              </div>
              <div class="space-y-2">
                <label class="text-xs font-black text-slate-400 uppercase tracking-wider ml-1">Exp. Level</label>
                <select v-model="newJob.experience_level" class="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all font-bold text-slate-900">
                  <option value="junior">Junior</option>
                  <option value="mid_level">Mid Level</option>
                  <option value="senior">Senior</option>
                </select>
              </div>
              <div class="space-y-2">
                <label class="text-xs font-black text-slate-400 uppercase tracking-wider ml-1">Vacancies</label>
                <input v-model.number="newJob.vacancies" type="number" min="1"
                  class="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all font-bold text-slate-900" />
              </div>
            </div>

            <!-- Content -->
            <div class="md:col-span-2 space-y-6 pt-4">
               <div class="flex items-center gap-2 mb-4">
                <span class="w-1 h-4 bg-indigo-600 rounded-full"></span>
                <h3 class="font-black text-slate-900 uppercase text-xs tracking-widest">Job Narrative</h3>
              </div>
              <div class="space-y-2">
                <label class="text-xs font-black text-slate-400 uppercase tracking-wider ml-1">Description</label>
                <textarea v-model="newJob.description" rows="4" placeholder="Describe the role..." 
                  class="w-full px-6 py-4 bg-gray-50 border-none rounded-[2rem] focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all font-bold text-slate-900 placeholder:text-gray-300 resize-none"></textarea>
              </div>
              <div class="space-y-2">
                <label class="text-xs font-black text-slate-400 uppercase tracking-wider ml-1">Requirements</label>
                <textarea v-model="newJob.requirements" rows="4" placeholder="What are the essential skills?" 
                  class="w-full px-6 py-4 bg-gray-50 border-none rounded-[2rem] focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all font-bold text-slate-900 placeholder:text-gray-300 resize-none"></textarea>
              </div>
            </div>

            <!-- Submit -->
            <div class="md:col-span-2 pt-6">
              <button 
                type="submit" 
                :disabled="submitLoading"
                class="w-full py-5 bg-indigo-600 text-white rounded-[2rem] font-black text-lg uppercase tracking-widest hover:bg-indigo-700 shadow-2xl shadow-indigo-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                <i v-if="submitLoading" class="pi pi-spin pi-spinner text-lg"></i>
                {{ submitLoading ? 'Publishing...' : 'Publish Job Listing' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
