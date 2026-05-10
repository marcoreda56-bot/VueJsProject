<template>
  <div class="space-y-8 font-['Outfit'] p-6 max-w-7xl mx-auto">
    <!-- Header Section -->
    <header class="flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <div class="flex items-center gap-2 mb-1">
          <span class="w-8 h-[2px] bg-indigo-600"></span>
          <p class="text-slate-400 font-black uppercase text-[10px] tracking-[0.3em]">
            Quality Assurance
          </p>
        </div>
        <h2 class="text-5xl font-black tracking-tighter text-slate-900 dark:text-white">
          Jobs
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-500"
            >Moderation</span
          >
        </h2>
      </div>

      <div
        class="flex items-center gap-3 bg-white/40 dark:bg-slate-800/40 backdrop-blur-md p-2 rounded-2xl border border-white/20"
      >
        <div class="px-4 py-2 text-center border-r border-slate-200 dark:border-slate-700">
          <p class="text-[10px] font-bold text-slate-400 uppercase">Queue</p>
          <p class="text-xl font-black text-slate-900 dark:text-white">
            {{ adminStore.jobs.length }}
          </p>
        </div>
        <div class="px-4 py-2 text-center">
          <p class="text-[10px] font-bold text-amber-500 uppercase">Pending</p>
          <p class="text-xl font-black text-amber-500">{{ adminStore.stats.pendingJobs }}</p>
        </div>
      </div>
    </header>

    <!-- Loading State -->
    <div
      v-if="adminStore.loading"
      class="flex flex-col items-center justify-center py-32 opacity-50"
    >
      <div class="relative w-16 h-16">
        <div class="absolute inset-0 border-4 border-indigo-600/20 rounded-full"></div>
        <div
          class="absolute inset-0 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"
        ></div>
      </div>
      <p class="mt-4 font-black uppercase text-[10px] tracking-widest text-indigo-600">
        Synchronizing Data...
      </p>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="adminStore.jobs.length === 0"
      class="flex flex-col items-center justify-center py-24 bg-white/20 dark:bg-slate-900/20 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[3rem]"
    >
      <div
        class="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 text-slate-400"
      >
        <i class="pi pi-briefcase text-3xl"></i>
      </div>
      <h3 class="text-xl font-bold text-slate-900 dark:text-white">All caught up!</h3>
      <p class="text-slate-500 text-sm">No job postings require moderation at the moment.</p>
    </div>

    <!-- Jobs List -->
    <div v-else class="grid grid-cols-1 gap-5">
      <div
        v-for="job in adminStore.jobs"
        :key="job.id"
        class="group relative bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl border border-white dark:border-slate-800 rounded-[2rem] p-5 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(79,70,229,0.1)] hover:border-indigo-500/50 flex flex-col lg:flex-row lg:items-center gap-6"
      >
        <!-- Left: Company & Title -->
        <div class="flex items-center gap-5 flex-1">
          <div class="relative">
            <div
              class="w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center shadow-sm overflow-hidden border border-slate-100 dark:border-slate-700"
            >
              <img
                v-if="job.employer?.logo_url"
                :src="job.employer.logo_url"
                class="w-full h-full object-cover"
              />
              <span v-else class="font-black text-xl text-indigo-600">
                {{ job?.title?.charAt(0) || '?' }}
              </span>
            </div>
            <div
              class="absolute -bottom-1 -right-1 w-6 h-6 bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-100 dark:border-slate-800 flex items-center justify-center"
            >
              <i class="pi pi-verified text-[10px] text-indigo-500"></i>
            </div>
          </div>

          <div class="space-y-1">
            <div class="flex flex-wrap items-center gap-2">
              <h4
                class="font-black text-xl text-slate-900 dark:text-white tracking-tight group-hover:text-indigo-600 transition-colors"
              >
                {{ job.title }}
              </h4>
              <!-- Dynamic Status Badge -->
              <div
                :class="{
                  'bg-emerald-500/10 text-emerald-600 border-emerald-500/20':
                    job.status === 'active',
                  'bg-amber-500/10 text-amber-600 border-amber-500/20':
                    job.status === 'pending' || job.status === 'pending_review',
                  'bg-rose-500/10 text-rose-600 border-rose-500/20': job.status === 'rejected',
                }"
                class="flex items-center gap-1.5 px-3 py-1 border rounded-full text-[9px] font-black uppercase tracking-tighter"
              >
                <span class="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>
                {{ job.status }}
              </div>
            </div>

            <div
              class="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-500 font-medium"
            >
              <span class="flex items-center gap-1.5">
                <i class="pi pi-building text-indigo-500/50"></i>
                <span class="text-slate-900 dark:text-slate-200 font-bold tracking-tight">{{
                  job.employer?.company_name
                }}</span>
              </span>
              <span class="flex items-center gap-1.5">
                <i class="pi pi-map-marker text-slate-400"></i>
                {{ job.location || 'Remote' }}
              </span>
              <span class="flex items-center gap-1.5">
                <i class="pi pi-calendar text-slate-400"></i>
                {{ new Date(job.created_at).toLocaleDateString() }}
              </span>
            </div>
          </div>
        </div>

        <!-- Right: Actions -->
        <div
          class="flex items-center justify-between lg:justify-end gap-3 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-100 dark:border-slate-800"
        >
          <div class="flex items-center gap-2">
            <!-- Reject -->
            <button
              v-if="job.status !== 'rejected'"
              @click="handleReject(job.id)"
              class="group/btn h-11 px-5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-rose-500 hover:border-rose-200 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all duration-300 text-[11px] font-bold uppercase tracking-widest flex items-center gap-2"
            >
              <i class="pi pi-times-circle"></i>
              Reject
            </button>

            <!-- Approve (Main Action) -->
            <button
              v-if="job.status !== 'active'"
              @click="handleApprove(job.id)"
              class="h-11 px-8 bg-slate-900 dark:bg-indigo-600 text-white rounded-xl text-[11px] font-black uppercase tracking-[0.2em] hover:shadow-[0_10px_25px_-5px_rgba(79,70,229,0.4)] hover:scale-[1.02] active:scale-95 transition-all"
            >
              Approve Post
            </button>
          </div>

          <!-- Subtle Delete -->
          <button
            @click="handleDelete(job.id)"
            class="w-11 h-11 flex items-center justify-center text-slate-300 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-all"
          >
            <i class="pi pi-trash"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAdminStore } from '@/stores/AdminStore'
import Swal from 'sweetalert2'

const adminStore = useAdminStore()

onMounted(() => {
  adminStore.fetchAdminJobs()
})

// تحسين الـ UX في التنبيهات
const handleApprove = async (id) => {
  const result = await Swal.fire({
    title: '<span class="font-black tracking-tighter">Approve Posting?</span>',
    text: 'The job will be live and searchable by candidates immediately.',
    icon: 'info',
    showCancelButton: true,
    confirmButtonText: 'Yes, Approve It',
    cancelButtonText: 'Cancel',
    buttonsStyling: false,
    customClass: {
      confirmButton:
        'bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold mx-2 shadow-lg shadow-indigo-200',
      cancelButton: 'bg-slate-100 text-slate-500 px-8 py-3 rounded-xl font-bold mx-2',
    },
  })

  if (result.isConfirmed) {
    await adminStore.approveJob(id)
    Swal.fire({
      title: 'Success!',
      text: 'Job is now active.',
      icon: 'success',
      timer: 1500,
      showConfirmButton: false,
    })
  }
}

const handleReject = async (id) => {
  const { value: reason } = await Swal.fire({
    title: 'Reject Posting',
    input: 'textarea',
    inputLabel: 'Reason for rejection (will be sent to employer)',
    inputPlaceholder: 'e.g. Missing contact information...',
    showCancelButton: true,
    confirmButtonText: 'Confirm Rejection',
    buttonsStyling: false,
    customClass: {
      confirmButton:
        'bg-rose-600 text-white px-8 py-3 rounded-xl font-bold mx-2 shadow-lg shadow-rose-200',
      cancelButton: 'bg-slate-100 text-slate-500 px-8 py-3 rounded-xl font-bold mx-2',
    },
  })

  if (reason) {
    await adminStore.rejectJob(id, reason)
  }
}

const handleDelete = async (id) => {
  const result = await Swal.fire({
    title: 'Are you sure?',
    // ... باقي الإعدادات
    showCancelButton: true,
  })

  if (result.isConfirmed) {
    // لازم await هنا عشان لو حصل خطأ الـ UI يستنى الـ Swal اللي في الستور
    await adminStore.deleteJob(id)
  }
}
</script>
