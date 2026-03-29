<template>
  <div class="min-h-screen bg-[#FAFAFA] dark:bg-slate-950 font-['Plus_Jakarta_Sans',sans-serif]">
    <!-- Hero -->
    <div class="max-w-[1800px] mx-auto mb-8">
      <section class="relative overflow-hidden bg-slate-900 rounded-[3rem] py-14 px-12 shadow-2xl animate-[fadeIn_0.8s_ease-out]">
        <div class="absolute -top-16 -right-16 w-64 h-64 bg-indigo-600/20 blur-[80px] rounded-full animate-pulse"></div>
        <div class="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h1 class="text-5xl font-black text-white tracking-tighter italic mb-3 leading-none">
              Applications <span class="text-indigo-400">Inbox</span>
            </h1>
            <p class="text-slate-400 font-medium text-lg max-w-lg">
              Review and respond to candidates who applied for your jobs.
            </p>
          </div>
          <div class="flex items-center gap-6 bg-white/5 backdrop-blur-3xl p-6 rounded-[2rem] border border-white/10">
            <div class="text-center px-6 border-r border-white/10">
              <p class="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Total</p>
              <p class="text-4xl font-black text-white italic tracking-tighter">{{ employerStore.totalApplications }}</p>
            </div>
            <div class="text-center px-6 border-r border-white/10">
              <p class="text-[10px] font-black text-amber-400 uppercase tracking-widest mb-1">Pending</p>
              <p class="text-4xl font-black text-white italic tracking-tighter">{{ employerStore.pendingApplications.length }}</p>
            </div>
            <div class="text-center px-6">
              <p class="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">Accepted</p>
              <p class="text-4xl font-black text-white italic tracking-tighter">{{ employerStore.acceptedApplications.length }}</p>
            </div>
          </div>
        </div>
      </section>
    </div>

    <div class="max-w-[1800px] mx-auto">
      <!-- Filter Bar -->
      <div class="flex flex-wrap gap-3 mb-8">
        <button
          v-for="f in filters"
          :key="f.value"
          @click="activeFilter = f.value"
          :class="[
            activeFilter === f.value ? filterStatusActiveStyle(f.value) : filterStatusInactiveStyle(f.value),
            'px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-2 border shadow-sm'
          ]"
        >
          {{ f.label }}
          <span
            :class="activeFilter === f.value ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'"
            class="px-2 py-0.5 rounded-full text-[9px] font-black"
          >{{ getFilterCount(f.value) }}</span>
        </button>
      </div>

      <!-- Loading -->
      <div v-if="employerStore.loading" class="text-center py-24 text-slate-400 font-bold italic text-lg">
        Loading applications...
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredApplications.length === 0" class="text-center py-24">
        <div class="w-24 h-24 bg-slate-100 dark:bg-slate-900 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-3xl text-slate-300 dark:text-slate-700">
          <i class="pi pi-inbox"></i>
        </div>
        <h3 class="text-3xl font-black text-slate-900 dark:text-white italic tracking-tight mb-2">No applications here.</h3>
        <p class="text-slate-400 font-medium">
          {{ activeFilter === 'all' ? 'Candidates haven\'t applied yet.' : `No ${activeFilter} applications.` }}
        </p>
      </div>

      <!-- Applications List -->
      <div v-else class="grid gap-6 pb-16">
        <div
          v-for="app in filteredApplications"
          :key="app.id"
          class="group bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-8 rounded-[2.5rem] shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-500"
        >
          <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
            <!-- Candidate Info -->
            <div class="flex items-start gap-6">
              <div class="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-indigo-600 font-black text-2xl italic group-hover:bg-indigo-600 group-hover:text-white transition-all flex-shrink-0">
                {{ (app.candidate_snapshot?.name || 'C').charAt(0).toUpperCase() }}
              </div>
              <div>
                <h4 class="text-2xl font-black text-slate-900 dark:text-white tracking-tighter group-hover:text-indigo-600 transition-colors mb-1">
                  {{ app.candidate_snapshot?.name || 'Candidate' }}
                </h4>
                <p class="text-indigo-500 font-black text-[11px] uppercase tracking-widest italic mb-2">
                  {{ app.candidate_snapshot?.email || '—' }}
                </p>
                <div class="flex flex-wrap items-center gap-3">
                  <span class="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-400">
                    <i class="pi pi-briefcase text-indigo-400 text-xs"></i>
                    Applied for: <span class="text-slate-700 dark:text-slate-300 font-black ml-1">{{ getJobTitle(app.job_id) }}</span>
                  </span>
                  <span class="w-1 h-1 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                  <span class="text-[11px] font-bold text-slate-400">{{ formatDate(app.applied_at) }}</span>
                </div>
                <!-- Cover Letter Preview -->
                <p v-if="app.cover_letter" class="text-slate-400 text-sm mt-3 leading-relaxed line-clamp-2 max-w-lg italic">
                  "{{ app.cover_letter }}"
                </p>
                <button 
                  @click="$router.push({ name: 'employer.application-details', params: { id: app.id } })"
                  class="mt-4 text-[10px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all"
                >
                  View Full Application <i class="pi pi-arrow-right"></i>
                </button>
              </div>
            </div>

            <!-- Status + Actions -->
            <div class="flex flex-col items-end gap-4 flex-shrink-0">
              <span :class="statusStyle(app.status)" class="px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border">
                {{ app.status }}
              </span>

              <div v-if="app.status === 'pending'" class="flex gap-3">
                <button
                  @click="handleStatusUpdate(app.id, 'accepted')"
                  class="px-6 py-3 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-emerald-100 dark:border-emerald-500/20 flex items-center gap-2"
                >
                  <i class="pi pi-check text-[9px]"></i> Accept
                </button>
                <button
                  @click="handleStatusUpdate(app.id, 'rejected')"
                  class="px-6 py-3 bg-rose-50 dark:bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-rose-100 dark:border-rose-500/20 flex items-center gap-2"
                >
                  <i class="pi pi-times text-[9px]"></i> Reject
                </button>
              </div>

              <div v-else class="flex gap-3">
                <button
                  v-if="app.status === 'accepted'"
                  @click="handleStatusUpdate(app.id, 'rejected')"
                  class="px-5 py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-500 hover:bg-rose-50 hover:text-rose-500 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-slate-100 dark:border-slate-700 flex items-center gap-2"
                >
                  <i class="pi pi-times text-[9px]"></i> Reject Instead
                </button>
                <button
                  v-if="app.status === 'rejected'"
                  @click="handleStatusUpdate(app.id, 'accepted')"
                  class="px-5 py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-500 hover:bg-emerald-50 hover:text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-slate-100 dark:border-slate-700 flex items-center gap-2"
                >
                  <i class="pi pi-check text-[9px]"></i> Accept Instead
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useEmployerStore } from '@/stores/employer.store'
import Swal from 'sweetalert2'

const employerStore = useEmployerStore()
const activeFilter = ref('all')

onMounted(async () => {
  await employerStore.initialize()
})

const filters = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Accepted', value: 'accepted' },
  { label: 'Rejected', value: 'rejected' },
]

const getFilterCount = (filter) => {
  if (filter === 'all') return employerStore.applications.length
  return employerStore.applications.filter((a) => a.status === filter).length
}

const filteredApplications = computed(() => {
  if (activeFilter.value === 'all') return employerStore.applications
  return employerStore.applications.filter((a) => a.status === activeFilter.value)
})

const getJobTitle = (jobId) => {
  const job = employerStore.jobs.find((j) => String(j.id) === String(jobId))
  return job?.title || 'Job Position'
}

const formatDate = (dateStr) => {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

const statusStyle = (status) => {
  const s = (status || '').toLowerCase()
  if (s === 'accepted') return 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:border-emerald-500/20 shadow-sm'
  if (s === 'rejected') return 'bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-500/10 dark:border-rose-500/20 shadow-sm'
  return 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-500/10 dark:border-amber-500/20 shadow-sm'
}

const filterStatusActiveStyle = (status) => {
  if (status === 'all') return 'bg-slate-900 text-white shadow-xl shadow-slate-200 dark:shadow-none border-slate-900'
  if (status === 'accepted') return 'bg-emerald-500 text-white shadow-xl shadow-emerald-100 dark:shadow-none border-emerald-500'
  if (status === 'rejected') return 'bg-rose-500 text-white shadow-xl shadow-rose-100 dark:shadow-none border-rose-500'
  if (status === 'pending') return 'bg-amber-500 text-white shadow-xl shadow-amber-100 dark:shadow-none border-amber-500'
  return 'bg-indigo-600 text-white border-indigo-600'
}

const filterStatusInactiveStyle = (status) => {
  const common = 'bg-white dark:bg-slate-900 transition-all border shadow-sm hover:translate-y-[-2px]'
  if (status === 'all') return `${common} border-slate-200 dark:border-slate-700 text-slate-600 hover:border-slate-400`
  if (status === 'accepted') return `${common} border-emerald-100 dark:border-emerald-500/20 text-emerald-600 hover:bg-emerald-50/50 dark:hover:bg-emerald-500/5`
  if (status === 'rejected') return `${common} border-rose-100 dark:border-rose-500/20 text-rose-500 hover:bg-rose-50/50 dark:hover:bg-rose-500/5`
  if (status === 'pending') return `${common} border-amber-100 dark:border-amber-500/20 text-amber-600 hover:bg-amber-50/50 dark:hover:bg-amber-500/5`
  return common
}

const handleStatusUpdate = async (appId, status) => {
  try {
    await employerStore.updateApplicationStatus(appId, status)
    const icon = status === 'accepted' ? 'success' : 'info'
    const msg = status === 'accepted' ? 'Application accepted!' : 'Application rejected.'
    Swal.fire({
      title: msg,
      icon,
      timer: 1500,
      showConfirmButton: false,
      customClass: { popup: 'rounded-[2rem] p-8' },
    })
  } catch {
    Swal.fire('Error', 'Could not update the application status.', 'error')
  }
}
</script>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.line-clamp-2 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>
