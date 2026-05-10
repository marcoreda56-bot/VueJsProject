<template>
  <div class="space-y-8 font-['Outfit'] p-4">
    <header class="flex justify-between items-center">
      <div>
        <h2 class="text-4xl font-black tracking-tighter text-slate-900 dark:text-white">
          Jobs <span class="text-indigo-600">Moderation</span>
        </h2>
        <p class="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em] mt-1">
          System Management & Quality Control
        </p>
      </div>

      <div class="flex gap-4">
        <div
          class="bg-white/50 backdrop-blur-md border border-white/20 p-3 rounded-2xl hidden md:block"
        >
          <p class="text-[10px] font-black uppercase text-slate-400">Pending Requests</p>
          <p class="text-xl font-black text-amber-500">{{ adminStore.stats.pendingJobs }}</p>
        </div>
      </div>
    </header>

    <div v-if="adminStore.loading" class="flex justify-center py-20">
      <i class="pi pi-spin pi-spinner text-4xl text-indigo-600"></i>
    </div>

    <div v-else class="grid grid-cols-1 gap-6">
      <div
        v-for="job in adminStore.jobs"
        :key="job.id"
        class="group relative p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/40 dark:border-slate-800 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 dark:shadow-none flex flex-col md:flex-row items-center justify-between transition-all hover:translate-y-[-4px]"
      >
        <div class="flex items-center gap-6 w-full">
          <!-- Logo / Placeholder -->
          <div
            class="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 rounded-3xl flex items-center justify-center overflow-hidden border-4 border-white dark:border-slate-800 shadow-inner"
          >
            <img
              v-if="job.employer?.logo_url"
              :src="job.employer.logo_url"
              class="w-full h-full object-cover"
            />
            <span v-else class="font-black text-2xl text-slate-400">{{ job.title.charAt(0) }}</span>
          </div>

          <div class="flex-1">
            <div class="flex items-center gap-3">
              <h4 class="font-black text-xl text-slate-900 dark:text-white tracking-tighter">
                {{ job.title }}
              </h4>
              <span
                :class="{
                  'bg-emerald-500/10 text-emerald-600': job.status === 'active',
                  'bg-amber-500/10 text-amber-600':
                    job.status === 'pending_review' || job.status === 'pending',
                  'bg-red-500/10 text-red-600': job.status === 'rejected',
                }"
                class="px-3 py-1 rounded-full text-[9px] font-black uppercase italic tracking-widest"
              >
                {{ job.status }}
              </span>
            </div>
            <p class="text-sm text-slate-400 font-medium">
              at
              <span class="text-indigo-600 font-bold uppercase tracking-tighter">{{
                job.employer?.company_name
              }}</span>
            </p>
          </div>
        </div>

        <div
          class="flex items-center gap-4 mt-6 md:mt-0 w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0 border-slate-100 dark:border-slate-800"
        >
          <div class="flex gap-2">
            <!-- Approve -->
            <button
              v-if="job.status !== 'active'"
              @click="adminStore.approveJob(job.id)"
              class="h-12 px-6 bg-slate-900 dark:bg-indigo-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-indigo-200 dark:shadow-none"
            >
              Approve
            </button>

            <!-- Reject -->
            <button
              v-if="job.status === 'pending_review' || job.status === 'pending'"
              @click="handleReject(job.id)"
              class="h-12 px-6 border-2 border-slate-100 dark:border-slate-800 text-slate-400 hover:text-red-500 hover:border-red-100 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all"
            >
              Reject
            </button>

            <!-- Delete -->
            <button
              @click="adminStore.deleteJob(job.id)"
              class="w-12 h-12 flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-2xl transition-all"
            >
              <i class="pi pi-trash"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAdminStore } from '@/stores/AdminStore'
import Swal from 'sweetalert2' // اختيارية لو حابب تطلع مودال شيك

const adminStore = useAdminStore()

onMounted(() => {
  adminStore.fetchAllData()
})

const handleReject = async (id) => {
  const { value: reason } = await Swal.fire({
    title: 'Reject Job Posting',
    input: 'textarea',
    inputLabel: 'Reason for rejection',
    inputPlaceholder: 'Type your reason here...',
    showCancelButton: true,
    confirmButtonColor: '#4f46e5',
    cancelButtonColor: '#f1f5f9',
    cancelButtonText: '<span style="color: #64748b">Cancel</span>',
  })

  if (reason) {
    adminStore.rejectJob(id, reason)
  }
}
</script>
