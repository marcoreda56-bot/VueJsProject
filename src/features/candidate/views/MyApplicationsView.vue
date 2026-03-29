<template>
  <div class="min-h-screen bg-[#FAFAFA] dark:bg-slate-950 font-['Outfit',sans-serif]">
    <div class="max-w-[1800px] mx-auto p-6">
      <section
        class="relative overflow-hidden bg-slate-900 rounded-[3rem] py-20 px-12 shadow-2xl animate-[fadeIn_0.8s_ease-out]"
      >
        <div
          class="absolute -top-12 -right-12 w-64 h-64 bg-indigo-600/20 blur-[80px] rounded-full animate-pulse"
        ></div>
        <div class="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
          <div>
            <h1 class="text-6xl font-black text-white tracking-tighter italic mb-4 leading-none">
              My <span class="text-indigo-500 text-7xl">Tracks</span>
            </h1>
            <p class="text-slate-400 font-medium text-lg max-w-md">
              Monitoring your progress with Egypt's top tech employers.
            </p>
          </div>
          <div
            class="flex items-center gap-6 bg-white/5 backdrop-blur-3xl p-8 rounded-[2.5rem] border border-white/10 shadow-2xl"
          >
            <div class="text-center px-8 border-r border-white/10">
              <p class="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">
                Total
              </p>
              <p class="text-4xl font-black text-white italic tracking-tighter">
                {{ candidateStore.applications.length }}
              </p>
            </div>
            <div class="text-center px-8">
              <p class="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-2">
                Success
              </p>
              <p class="text-4xl font-black text-white italic tracking-tighter">85%</p>
            </div>
          </div>
        </div>
      </section>
    </div>

    <section class="max-w-[1800px] mx-auto px-6 py-12">
      <div v-if="candidateStore.applications.length === 0" class="text-center py-32">
        <div
          class="w-24 h-24 bg-slate-100 dark:bg-slate-900 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 text-slate-300 text-4xl italic font-black"
        >
          ?
        </div>
        <h3 class="text-3xl font-black text-slate-900 dark:text-white italic tracking-tight">
          No tracks found.
        </h3>
      </div>

      <div v-else class="space-y-10">
        <div
          v-for="app in candidateStore.applications"
          :key="app.id"
          class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-10 rounded-[3.5rem] shadow-sm hover:shadow-2xl transition-all duration-500 group"
        >
          <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10">
            <div class="flex items-start gap-8">
              <div
                class="w-24 h-24 bg-slate-50 dark:bg-slate-800 rounded-[2.2rem] flex items-center justify-center text-indigo-600 font-black text-4xl italic transition-all group-hover:bg-indigo-600 group-hover:text-white shadow-inner"
              >
                {{ getJobFullDetails(app.job_id).title.charAt(0) }}
              </div>
              <div>
                <h4
                  class="text-4xl font-black text-slate-900 dark:text-white tracking-tighter italic mb-3 group-hover:text-indigo-600 transition-colors"
                >
                  {{ getJobFullDetails(app.job_id).title }}
                </h4>
                <div class="flex flex-wrap items-center gap-3 mb-5">
                  <span
                    class="px-4 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-[10px] font-black text-slate-500 uppercase flex items-center gap-2"
                  >
                    <i class="pi pi-map-marker text-indigo-500"></i>
                    {{ getJobFullDetails(app.job_id).location }}
                  </span>
                </div>
                <div class="flex items-center gap-5">
                  <span
                    class="text-indigo-500 font-black text-[11px] uppercase tracking-[0.2em] italic"
                    >{{ getJobFullDetails(app.job_id).company }}</span
                  >
                  <span class="w-1.5 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                  <span class="text-slate-400 font-bold text-[11px] uppercase tracking-widest"
                    >Applied: {{ formatDate(app.applied_at) }}</span
                  >
                </div>
              </div>
            </div>

            <div class="flex flex-col items-end gap-6 w-full lg:w-auto">
              <div
                :class="statusStyle(app.status)"
                class="px-10 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] border shadow-sm"
              >
                {{ app.status }}
              </div>

              <div class="flex items-center gap-4 w-full lg:w-auto">
                <button
                  @click="handleWithdraw(app.id)"
                  class="px-6 py-4 bg-rose-50 dark:bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 border border-rose-100 dark:border-rose-500/20"
                >
                  <i class="pi pi-trash text-[9px]"></i> Withdraw
                </button>

                <button
                  @click="openDetails(app.job_id)"
                  class="px-8 py-4 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:translate-x-1 transition-transform flex items-center gap-3 shadow-lg"
                >
                  Check Details <i class="pi pi-arrow-right text-[8px]"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <div
      v-if="selectedJob"
      class="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md"
    >
      <div
        class="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[3.5rem] p-12 relative shadow-2xl animate-[fadeIn_0.3s_ease-out]"
      >
        <button
          @click="selectedJob = null"
          class="absolute top-10 right-10 text-slate-400 hover:text-rose-500 transition-colors"
        >
          <i class="pi pi-times text-2xl"></i>
        </button>
        <h2 class="text-4xl font-black text-slate-900 dark:text-white tracking-tighter italic mb-2">
          {{ selectedJob.title }}
        </h2>
        <p class="text-indigo-500 font-black uppercase tracking-widest text-xs mb-10">
          {{ selectedJob.company }}
        </p>
        <div class="space-y-8 overflow-y-auto max-h-[50vh] pr-6 custom-scroll">
          <div>
            <h5 class="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-3">
              Job Description
            </h5>
            <p class="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
              {{ selectedJob.description }}
            </p>
          </div>
          <div>
            <h5 class="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-3">
              Technical Requirements
            </h5>
            <div
              class="text-slate-600 dark:text-slate-400 whitespace-pre-line leading-relaxed text-sm bg-slate-50 dark:bg-slate-800/50 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 font-mono"
            >
              {{ selectedJob.requirements }}
            </div>
          </div>
        </div>
        <div class="mt-10 pt-8 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            @click="selectedJob = null"
            class="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em]"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useCandidateStore } from '@/stores/candidate.store'
import { useJobsStore } from '@/stores/jobs'
import Swal from 'sweetalert2'

const candidateStore = useCandidateStore()
const jobsStore = useJobsStore()
const selectedJob = ref(null)

onMounted(async () => {
  try {
    await candidateStore.initialize()
    await jobsStore.initialize()
  } catch (error) {
    console.error('Error during mounting:', error)
  }
})

const handleWithdraw = async (appId) => {
  const result = await Swal.fire({
    title: 'Withdraw Track?',
    text: 'This will permanently remove your application.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#f43f5e',
    confirmButtonText: 'Yes, withdraw',
    background: '#ffffff',
    customClass: {
      popup: 'rounded-[3rem] p-10',
      confirmButton: 'rounded-xl font-black uppercase tracking-widest text-[10px] py-4 px-8',
      cancelButton: 'rounded-xl font-black uppercase tracking-widest text-[10px] py-4 px-8',
    },
  })

  if (result.isConfirmed) {
    try {
      await candidateStore.withdrawApplication(appId)
      Swal.fire({ title: 'Removed', icon: 'success', timer: 2000, showConfirmButton: false })
    } catch (error) {
      Swal.fire('Error', 'Could not withdraw at this time.', 'error')
    }
  }
}

const getJobFullDetails = (jobId) => {
  const job = jobsStore.jobs.find((j) => String(j.id) === String(jobId))
  if (!job) return { title: 'Technical Role', company: '...', location: 'Egypt' }
  const employer = jobsStore.employers.find((e) => String(e.id) === String(job.employer_id))
  return { ...job, company: employer?.company_name || 'Tech Company' }
}

const openDetails = (jobId) => {
  selectedJob.value = getJobFullDetails(jobId)
}
const formatDate = (dateStr) => {
  if (!dateStr) return 'Pending'
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

const statusStyle = (status) => {
  const s = status?.toLowerCase() || ''

  if (s.includes('accept') || s.includes('offer') || s.includes('hired')) {
    return `
      bg-emerald-100 text-emerald-700 border-emerald-400 
      shadow-[0_0_15px_rgba(16,185,129,0.1)] 
      dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/40
    `
  }
  if (s.includes('interview')) {
    return 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20'
  }

  if (s.includes('reject') || s.includes('withdraw')) {
    return 'bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20'
  }

  if (s.includes('review') || s.includes('progress')) {
    return 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20'
  }

  return 'bg-slate-50 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
}
</script>
