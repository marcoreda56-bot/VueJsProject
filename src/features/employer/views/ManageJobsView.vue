<template>
  <div class="min-h-screen bg-[#FAFAFA] dark:bg-slate-950 font-['Outfit',sans-serif]">
    <!-- Header -->
    <div class="mb-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
      <div>
        <p class="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1">Employer Portal</p>
        <h1 class="text-5xl font-black text-slate-900 dark:text-white tracking-tighter italic leading-tight">
          My <span class="text-indigo-600">Jobs</span>
        </h1>
        <p class="text-slate-500 font-medium mt-2">Manage, edit, or close your posted listings.</p>
      </div>
      <button
        @click="$router.push({ name: 'employer.post-job' })"
        class="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-indigo-100 dark:shadow-none hover:bg-indigo-500 hover:-translate-y-0.5 active:scale-95 transition-all flex items-center gap-3"
      >
        <i class="pi pi-plus-circle"></i> Post New Job
      </button>
    </div>

    <!-- Loading -->
    <div v-if="employerStore.loading" class="text-center py-24 text-slate-400 font-bold italic text-lg">
      Loading your jobs...
    </div>

    <!-- Empty -->
    <div v-else-if="employerStore.jobs.length === 0" class="text-center py-24">
      <div class="w-24 h-24 bg-slate-100 dark:bg-slate-900 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-3xl text-slate-300 dark:text-slate-700">
        <i class="pi pi-briefcase"></i>
      </div>
      <h3 class="text-3xl font-black text-slate-900 dark:text-white italic tracking-tight mb-3">No jobs posted yet.</h3>
      <p class="text-slate-400 font-medium mb-8">Start attracting top talent by posting your first job.</p>
      <button
        @click="$router.push({ name: 'employer.post-job' })"
        class="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-indigo-500 transition-all"
      >
        Post First Job
      </button>
    </div>

    <!-- Jobs Grid -->
    <div v-else class="grid gap-6">
      <div
        v-for="job in employerStore.jobs"
        :key="job.id"
        class="group bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-500"
      >
        <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
          <!-- Job Info -->
          <div class="flex items-start gap-6">
            <div class="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-indigo-600 font-black text-2xl italic group-hover:bg-indigo-600 group-hover:text-white transition-all flex-shrink-0">
              {{ job.title?.charAt(0) || 'J' }}
            </div>
            <div class="flex-1">
              <div class="flex items-center gap-3 mb-2 flex-wrap">
                <h3 class="text-2xl font-black text-slate-900 dark:text-white tracking-tighter group-hover:text-indigo-600 transition-colors">
                  {{ job.title }}
                </h3>
                <span
                  :class="job.status === 'active'
                    ? 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:border-emerald-500/20'
                    : 'bg-slate-100 text-slate-400 border-slate-200 dark:bg-slate-800 dark:border-slate-700'"
                  class="px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest border"
                >
                  {{ job.status }}
                </span>
              </div>
              <div class="flex flex-wrap items-center gap-3">
                <span class="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-400">
                  <i class="pi pi-map-marker text-indigo-400 text-xs"></i> {{ job.location || 'Remote' }}
                </span>
                <span class="w-1 h-1 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                <span class="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-400">
                  <i class="pi pi-desktop text-indigo-400 text-xs"></i> {{ job.work_type || 'onsite' }}
                </span>
                <span class="w-1 h-1 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                <span class="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-400">
                  <i class="pi pi-inbox text-indigo-400 text-xs"></i>
                  {{ getAppCount(job.id) }} application{{ getAppCount(job.id) !== 1 ? 's' : '' }}
                </span>
                <span v-if="job.created_at" class="w-1 h-1 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                <span v-if="job.created_at" class="text-[11px] font-bold text-slate-400">
                  Posted {{ formatDate(job.created_at) }}
                </span>
              </div>
              <!-- Technologies -->
              <div v-if="job.technologies?.length" class="flex flex-wrap gap-1.5 mt-3">
                <span
                  v-for="tech in job.technologies.slice(0, 5)"
                  :key="tech"
                  class="px-2.5 py-1 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-lg text-[9px] font-black border border-indigo-100 dark:border-indigo-500/20"
                >{{ tech }}</span>
                <span v-if="job.technologies.length > 5" class="px-2.5 py-1 bg-slate-50 dark:bg-slate-800 text-slate-400 rounded-lg text-[9px] font-black">
                  +{{ job.technologies.length - 5 }}
                </span>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-3 flex-shrink-0 flex-wrap">
            <button
              @click="openJobDetails(job)"
              class="px-5 py-3 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-slate-100 dark:border-slate-700 flex items-center gap-2"
            >
              <i class="pi pi-eye text-[9px]"></i> View Details
            </button>

            <router-link
              :to="{ name: 'employer.edit-job', params: { id: job.id } }"
              class="px-5 py-3 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-slate-100 dark:border-slate-700 flex items-center gap-2"
            >
              <i class="pi pi-pencil text-[9px]"></i> Edit
            </router-link>

            <button
              @click="handleToggleStatus(job)"
              :class="job.status === 'active'
                ? 'bg-amber-50 text-amber-600 border-amber-100 hover:bg-amber-500 hover:text-white dark:bg-amber-500/10 dark:border-amber-500/20'
                : 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-500 hover:text-white dark:bg-emerald-500/10 dark:border-emerald-500/20'"
              class="px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border flex items-center gap-2"
            >
              <i :class="job.status === 'active' ? 'pi pi-ban' : 'pi pi-play-circle'" class="text-[9px]"></i>
              {{ job.status === 'active' ? 'Close' : 'Reopen' }}
            </button>

            <button
              @click="handleDelete(job)"
              class="px-5 py-3 bg-rose-50 dark:bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-rose-100 dark:border-rose-500/20 flex items-center gap-2"
            >
              <i class="pi pi-trash text-[9px]"></i> Delete
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Job Details Modal -->
    <JobDetailsModal 
      v-if="selectedJob"
      :is-open="showDetailsModal"
      :job="selectedJob"
      @close="showDetailsModal = false"
      @edit="handleEditFromModal"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useEmployerStore } from '@/stores/employer.store'
import JobDetailsModal from '../components/JobDetailsModal.vue'
import Swal from 'sweetalert2'

const router = useRouter()
const employerStore = useEmployerStore()

const showDetailsModal = ref(false)
const selectedJob = ref(null)

const openJobDetails = (job) => {
  selectedJob.value = job
  showDetailsModal.value = true
}

const handleEditFromModal = (jobId) => {
  showDetailsModal.value = false
  router.push({ name: 'employer.edit-job', params: { id: jobId } })
}

onMounted(async () => {
  await employerStore.initialize()
})

const getAppCount = (jobId) => employerStore.getApplicationsForJob(jobId).length

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

const handleToggleStatus = async (job) => {
  const action = job.status === 'active' ? 'close' : 'reopen'
  const result = await Swal.fire({
    title: `${action.charAt(0).toUpperCase() + action.slice(1)} this job?`,
    text: job.status === 'active'
      ? 'Candidates will no longer be able to apply.'
      : 'This job will be visible to candidates again.',
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: job.status === 'active' ? '#f59e0b' : '#10b981',
    confirmButtonText: `Yes, ${action} it`,
    customClass: {
      popup: 'rounded-[2rem] p-10',
      confirmButton: 'rounded-xl font-black uppercase tracking-widest text-[10px] py-4 px-8',
      cancelButton: 'rounded-xl font-black uppercase tracking-widest text-[10px] py-4 px-8',
    },
  })
  if (result.isConfirmed) {
    try {
      await employerStore.toggleJobStatus(job)
    } catch {
      Swal.fire('Error', 'Could not update job status.', 'error')
    }
  }
}

const handleDelete = async (job) => {
  const result = await Swal.fire({
    title: 'Delete this job?',
    text: `"${job.title}" will be permanently removed along with its applications.`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#f43f5e',
    confirmButtonText: 'Yes, delete',
    customClass: {
      popup: 'rounded-[2rem] p-10',
      confirmButton: 'rounded-xl font-black uppercase tracking-widest text-[10px] py-4 px-8',
      cancelButton: 'rounded-xl font-black uppercase tracking-widest text-[10px] py-4 px-8',
    },
  })
  if (result.isConfirmed) {
    try {
      await employerStore.deleteJob(job.id)
      Swal.fire({ title: 'Deleted!', icon: 'success', timer: 1500, showConfirmButton: false })
    } catch {
      Swal.fire('Error', 'Could not delete the job.', 'error')
    }
  }
}
</script>
