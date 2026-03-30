<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAdminStore } from '@/stores/admin.store'
import Swal from 'sweetalert2'

const route = useRoute()
const router = useRouter()
const adminStore = useAdminStore()
const jobId = route.params.id
const actionLoading = ref(null)

const job = computed(() => adminStore.jobs.find(j => j.id == jobId) || {})
const employer = computed(() => adminStore.employers.find(e => String(e.user_id) === String(job.value.employer_id)) || {})

const jobApplications = computed(() => {
  return adminStore.applications.filter(app => app.job_id == jobId)
})

const getCandidateInfo = (candidateId) => {
  return adminStore.users.find(u => u.id == candidateId) || { name: 'Unknown', email: 'N/A' }
}

const getStatusBadgeClass = (status) => {
  switch (status) {
    case 'active': return 'bg-emerald-100 text-emerald-700'
    case 'pending': return 'bg-amber-100 text-amber-700'
    case 'closed': return 'bg-gray-100 text-gray-700'
    case 'rejected': return 'bg-red-100 text-red-700'
    default: return 'bg-gray-100 text-gray-700'
  }
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })
}

const handleStatusChange = async (status) => {
  const label = status === 'active' ? 'approve' : status === 'rejected' ? 'reject' : 'close'
  const result = await Swal.fire({
    title: `${label.charAt(0).toUpperCase() + label.slice(1)} this job?`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: status === 'active' ? '#4f46e5' : status === 'rejected' ? '#dc2626' : '#6b7280',
    confirmButtonText: `Yes, ${label} it`,
  })
  if (!result.isConfirmed) return

  actionLoading.value = status
  try {
    await adminStore.updateJobStatus(job.value.id, status)
    Swal.fire({ title: 'Updated!', icon: 'success', timer: 1500, showConfirmButton: false })
  } catch {
    Swal.fire('Error', 'Failed to update job status.', 'error')
  } finally {
    actionLoading.value = null
  }
}

const handleDelete = async () => {
  const result = await Swal.fire({
    title: 'Delete this job permanently?',
    text: 'This action cannot be undone.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#dc2626',
    confirmButtonText: 'Yes, delete it',
  })
  if (!result.isConfirmed) return

  actionLoading.value = 'delete'
  try {
    await adminStore.deleteJob(job.value.id)
    Swal.fire({ title: 'Deleted!', icon: 'success', timer: 1500, showConfirmButton: false })
    router.push('/admin/management/jobs')
  } catch {
    Swal.fire('Error', 'Failed to delete job.', 'error')
  } finally {
    actionLoading.value = null
  }
}
</script>

<template>
  <div class="p-10 max-w-[1800px] mx-auto">
    <!-- Breadcrumbs / Back -->
    <button @click="router.back()" class="flex items-center gap-2 text-gray-400 hover:text-indigo-600 font-bold text-sm mb-8 transition-colors group">
      <i class="pi pi-arrow-left group-hover:-translate-x-1 transition-transform"></i>
      Back to Listings
    </button>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-10">
      <!-- Main Content -->
      <div class="lg:col-span-2 space-y-10">
        <!-- Job Hero -->
        <div class="bg-white border border-gray-100 p-10 rounded-[3rem] shadow-sm relative overflow-hidden">
          <div class="absolute top-0 right-0 w-32 h-32 bg-indigo-50/50 rounded-bl-[5rem]"></div>
          
          <div class="flex items-center gap-3 mb-6 relative">
            <span :class="[getStatusBadgeClass(job.status), 'text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full']">
              {{ job.status || 'Active' }}
            </span>
            <span class="text-xs font-black text-gray-400 uppercase tracking-widest">{{ job.type }} • {{ job.location }}</span>
          </div>

          <h1 class="text-4xl font-black text-slate-900 tracking-tighter italic mb-6 leading-tight">
            {{ job.title }}<span class="text-indigo-600">.</span>
          </h1>

          <div class="flex flex-col sm:flex-row gap-4 mb-8">
            <template v-if="job.status === 'pending'">
              <button 
                @click="handleStatusChange('active')"
                :disabled="actionLoading === 'active'"
                class="px-8 py-3 bg-indigo-600 text-white rounded-2xl font-bold text-sm hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <i :class="actionLoading === 'active' ? 'pi pi-spin pi-spinner text-xs' : 'pi pi-check text-xs'"></i>
                Approve Listing
              </button>
              <button 
                @click="handleStatusChange('rejected')"
                :disabled="actionLoading === 'rejected'"
                class="px-8 py-3 bg-red-50 text-red-600 rounded-2xl font-bold text-sm hover:bg-red-100 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <i :class="actionLoading === 'rejected' ? 'pi pi-spin pi-spinner text-xs' : 'pi pi-times text-xs'"></i>
                Reject Job
              </button>
            </template>
            <template v-else-if="job.status === 'active'">
              <button 
                @click="handleStatusChange('closed')"
                :disabled="actionLoading === 'closed'"
                class="px-8 py-3 bg-gray-100 text-gray-600 rounded-2xl font-bold text-sm hover:bg-gray-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <i :class="actionLoading === 'closed' ? 'pi pi-spin pi-spinner text-xs' : 'pi pi-lock text-xs'"></i>
                Close Posting
              </button>
            </template>
            <template v-else-if="job.status === 'rejected' || job.status === 'closed'">
               <button 
                @click="handleStatusChange('active')"
                :disabled="actionLoading === 'active'"
                class="px-8 py-3 bg-emerald-50 text-emerald-600 rounded-2xl font-bold text-sm hover:bg-emerald-100 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <i :class="actionLoading === 'active' ? 'pi pi-spin pi-spinner text-xs' : 'pi pi-refresh text-xs'"></i>
                Re-activate
              </button>
            </template>
            <button 
              @click="handleDelete"
              :disabled="actionLoading === 'delete'"
              class="px-8 py-3 bg-white border border-red-100 text-red-400 rounded-2xl font-bold text-sm hover:bg-red-50 hover:text-red-600 transition-all flex items-center justify-center gap-2 sm:ml-auto disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <i :class="actionLoading === 'delete' ? 'pi pi-spin pi-spinner text-xs' : 'pi pi-trash text-xs'"></i>
              Delete Permanently
            </button>
          </div>

          <div class="flex flex-wrap gap-8 py-8 border-t border-gray-50 items-center">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                <i class="pi pi-money-bill"></i>
              </div>
              <div>
                <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Salary Range</p>
                <p class="font-bold text-slate-900 text-sm">{{ job.salary_min }} - {{ job.salary_max }} {{ job.currency }}</p>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                <i class="pi pi-users font-bold"></i>
              </div>
              <div>
                <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Vacancies</p>
                <p class="font-bold text-slate-900 text-sm">{{ job.vacancies }} Open Roles</p>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600">
                <i class="pi pi-calendar"></i>
              </div>
              <div>
                <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Posted On</p>
                <p class="font-bold text-slate-900 text-sm">{{ formatDate(job.created_at) }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Description & Requirements -->
        <div class="bg-white border border-gray-100 p-10 rounded-[3rem] shadow-sm space-y-8">
          <div>
            <div class="flex items-center gap-2 mb-4">
              <span class="w-1 h-4 bg-indigo-600 rounded-full"></span>
              <h3 class="font-black text-slate-900 uppercase text-xs tracking-widest">Role Description</h3>
            </div>
            <p class="text-gray-600 font-medium leading-relaxed whitespace-pre-line">{{ job.description }}</p>
          </div>
          
          <div v-if="job.requirements">
            <div class="flex items-center gap-2 mb-4">
              <span class="w-1 h-4 bg-indigo-600 rounded-full"></span>
              <h3 class="font-black text-slate-900 uppercase text-xs tracking-widest">Key Requirements</h3>
            </div>
            <p class="text-gray-600 font-medium leading-relaxed whitespace-pre-line">{{ job.requirements }}</p>
          </div>
        </div>

        <!-- Candidates Table -->
        <div class="bg-white border border-gray-100 rounded-[3rem] shadow-sm overflow-hidden">
          <div class="p-8 border-b border-gray-50">
            <h3 class="font-black text-slate-900 italic text-xl">Applicants ({{ jobApplications.length }})<span class="text-indigo-600">.</span></h3>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-left">
              <thead>
                <tr class="bg-gray-50/50">
                  <th class="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Candidate</th>
                  <th class="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Applied Date</th>
                  <th class="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Resume</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-50">
                <tr v-for="app in jobApplications" :key="app.id" class="hover:bg-gray-50/50 transition-all">
                  <td class="px-8 py-6">
                    <div class="flex items-center gap-3">
                      <div class="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs font-black">
                        {{ getCandidateInfo(app.candidate_id).name.charAt(0) }}
                      </div>
                      <div>
                        <p class="font-bold text-slate-900 text-sm leading-none mb-1">{{ getCandidateInfo(app.candidate_id).name }}</p>
                        <p class="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{{ getCandidateInfo(app.candidate_id).email }}</p>
                      </div>
                    </div>
                  </td>
                  <td class="px-8 py-6 text-sm font-bold text-slate-600">
                    {{ formatDate(app.created_at) }}
                  </td>
                  <td class="px-8 py-6 text-right">
                    <a v-if="app.resume_url" :href="app.resume_url" target="_blank" class="text-indigo-600 hover:text-indigo-800 font-black text-xs uppercase tracking-widest">View PDF</a>
                    <span v-else class="text-gray-300 font-black text-[10px] uppercase">No File</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-if="jobApplications.length === 0" class="p-20 text-center">
             <i class="pi pi-inbox text-4xl text-gray-100 mb-4"></i>
             <p class="text-gray-400 font-bold text-sm">No applications received yet for this position.</p>
          </div>
        </div>
      </div>

      <!-- Sidebar -->
      <div class="space-y-10">
        <!-- Employer Section -->
        <div class="bg-white border border-gray-100 p-8 rounded-[3rem] shadow-sm">
          <div class="flex items-center gap-2 mb-6">
            <span class="w-1 h-4 bg-indigo-600 rounded-full"></span>
            <h3 class="font-black text-slate-900 uppercase text-xs tracking-widest">About Employer</h3>
          </div>
          
          <div class="text-center mb-8">
            <div class="w-20 h-20 bg-gray-50 rounded-3xl mx-auto mb-4 flex items-center justify-center border border-gray-100 overflow-hidden p-2">
              <img v-if="employer.logo" :src="employer.logo" alt="" class="w-full h-full object-contain" />
              <i v-else class="pi pi-building text-3xl text-gray-200"></i>
            </div>
            <h4 class="text-xl font-black text-slate-900 tracking-tight">{{ employer.company_name }}</h4>
            <p class="text-indigo-600 font-bold text-xs uppercase tracking-wider mt-1">{{ employer.industry }}</p>
          </div>

          <div class="space-y-4">
            <div class="flex items-center justify-between py-3 border-b border-gray-50">
              <span class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Office</span>
              <span class="text-sm font-bold text-slate-600">{{ employer.address || 'Cairo, Egypt' }}</span>
            </div>
            <div class="flex items-center justify-between py-3 border-b border-gray-50">
              <span class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Website</span>
              <a :href="employer.website" class="text-sm font-bold text-indigo-600 hover:underline overflow-hidden text-ellipsis">{{ employer.website }}</a>
            </div>
          </div>

          <p class="mt-6 text-sm text-gray-500 italic font-medium leading-relaxed">
            "{{ employer.description || 'No company description available.' }}"
          </p>
        </div>

        <!-- Quick Stats -->
        <div class="bg-indigo-600 p-8 rounded-[3rem] shadow-xl shadow-indigo-100 text-white relative overflow-hidden">
          <div class="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
          <h3 class="font-black italic text-xl mb-6 relative z-10">Engagement Statistics<span class="text-indigo-300">.</span></h3>
          <div class="space-y-6 relative z-10">
            <div>
              <p class="text-[10px] font-black text-indigo-300 uppercase tracking-widest mb-1">Total Views</p>
              <p class="text-3xl font-black tracking-tight">{{ job.views || 0 }}</p>
            </div>
            <div>
              <p class="text-[10px] font-black text-indigo-300 uppercase tracking-widest mb-1">Conversion Rate</p>
              <p class="text-3xl font-black tracking-tight">{{ job.views ? ((jobApplications.length / job.views) * 100).toFixed(1) : 0 }}%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
