<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <h2 class="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
        My <span class="text-indigo-600 italic">Postings</span>
      </h2>
      <router-link
        to="/employer/post-job"
        class="px-6 py-3 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20"
      >
        <i class="pi pi-plus mr-2"></i> Post Job
      </router-link>
    </div>

    <!-- Loading -->
    <div v-if="employerStore.loading" class="flex justify-center py-20">
      <i class="pi pi-spin pi-spinner text-3xl text-indigo-600"></i>
    </div>

    <!-- Jobs Table/List -->
    <div v-else-if="employerStore.myJobs.length > 0" class="grid gap-4">
      <div
        v-for="job in employerStore.myJobs"
        :key="job.id"
        class="bg-white dark:bg-slate-900 p-6 rounded-4xl border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 group hover:border-indigo-200 transition-all shadow-sm"
      >
        <div class="flex items-center gap-4 flex-1 min-w-0">
          <div
            class="w-14 h-14 bg-indigo-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-indigo-600 font-black text-xl group-hover:bg-indigo-600 group-hover:text-white transition-all shrink-0"
          >
            {{ job.title.charAt(0) }}
          </div>
          <div class="min-w-0">
            <router-link
              :to="`/employer/jobs/${job.id}`"
              class="font-black text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors truncate hover:underline"
            >
              {{ job.title }}
            </router-link>
            <div
              class="flex flex-wrap gap-3 text-[10px] font-bold text-slate-400 uppercase mt-1 tracking-widest"
            >
              <span><i class="pi pi-map-marker"></i> {{ job.city }}</span>
              <span class="text-indigo-200">|</span>
              <span
                ><i class="pi pi-calendar"></i>
                {{ new Date(job.created_at).toLocaleDateString() }}</span
              >
              <span class="text-indigo-200">|</span>
              <span><i class="pi pi-users"></i> {{ job.applications_count || 0 }} apps</span>
            </div>
          </div>
        </div>

        <div class="flex items-center gap-2 flex-wrap">
          <!-- Status -->
          <span
            :class="getStatusClass(job.status)"
            class="text-[9px] font-black px-4 py-1.5 rounded-full uppercase"
          >
            {{ job.status?.replace('_', ' ') }}
          </span>

          <!-- Status Actions -->
          <button
            v-if="job.status === 'active'"
            @click="changeStatus(job.id, 'paused')"
            class="px-3 py-1.5 rounded-xl bg-amber-50 text-amber-600 text-[10px] font-black uppercase tracking-widest hover:bg-amber-100 transition"
            title="Pause"
          >
            <i class="pi pi-pause"></i>
          </button>
          <button
            v-if="job.status === 'paused'"
            @click="changeStatus(job.id, 'active')"
            class="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest hover:bg-emerald-100 transition"
            title="Resume"
          >
            <i class="pi pi-play"></i>
          </button>
          <button
            v-if="['active', 'paused', 'draft'].includes(job.status)"
            @click="changeStatus(job.id, 'closed')"
            class="px-3 py-1.5 rounded-xl bg-slate-50 text-slate-600 text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition"
            title="Close"
          >
            <i class="pi pi-lock"></i>
          </button>

          <!-- Actions -->
          <router-link
            :to="`/employer/jobs/${job.id}`"
            class="w-10 h-10 rounded-xl hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 flex items-center justify-center transition-all"
            title="View Job"
          >
            <i class="pi pi-eye text-sm"></i>
          </router-link>
          <router-link
            :to="`/employer/jobs/${job.id}/edit`"
            class="w-10 h-10 rounded-xl hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 flex items-center justify-center transition-all"
            title="Edit Job"
          >
            <i class="pi pi-pencil text-sm"></i>
          </router-link>
          <router-link
            v-if="job.applications_count > 0"
            :to="`/employer/jobs/${job.id}/applications`"
            class="w-10 h-10 rounded-xl hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 flex items-center justify-center transition-all"
            title="View Applications"
          >
            <i class="pi pi-users text-sm"></i>
          </router-link>
          <button
            @click="confirmDelete(job.id)"
            class="w-10 h-10 rounded-xl hover:bg-rose-50 text-slate-400 hover:text-rose-600 flex items-center justify-center transition-all"
            title="Delete Job"
          >
            <i class="pi pi-trash text-sm"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-else
      class="text-center py-20 bg-slate-50 dark:bg-slate-900/50 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800"
    >
      <i class="pi pi-briefcase text-5xl text-slate-300 mb-4"></i>
      <p class="text-slate-500 font-bold uppercase text-xs tracking-widest">No jobs posted yet</p>
      <router-link
        to="/employer/post-job"
        class="inline-block mt-4 text-indigo-600 font-black text-sm underline"
        >Post your first job</router-link
      >
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useEmployerStore } from '@/stores/EmployerStore'
import Swal from 'sweetalert2'

const employerStore = useEmployerStore()

onMounted(() => employerStore.fetchMyJobs())

const getStatusClass = (status) => {
  const styles = {
    active: 'bg-emerald-50 text-emerald-600',
    draft: 'bg-slate-100 text-slate-500',
    pending_review: 'bg-amber-50 text-amber-600',
    rejected: 'bg-rose-50 text-rose-600',
    closed: 'bg-slate-200 text-slate-700',
    expired: 'bg-orange-50 text-orange-600',
    paused: 'bg-orange-50 text-orange-600',
  }
  return styles[status] || 'bg-blue-50 text-blue-600'
}

const changeStatus = async (id, status) => {
  try {
    await employerStore.changeJobStatus(id, status)
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: `Job ${status.replace('_', ' ')}`,
      showConfirmButton: false,
      timer: 2000,
    })
  } catch (err) {
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'error',
      title: err.response?.data?.message || 'Failed to update status',
      showConfirmButton: false,
      timer: 3000,
    })
  }
}

const confirmDelete = async (id) => {
  const result = await Swal.fire({
    title: 'Delete Job?',
    text: 'This action cannot be undone. All associated applications will also be affected.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#e11d48',
    cancelButtonColor: '#94a3b8',
    confirmButtonText: 'Delete',
    cancelButtonText: 'Cancel',
    background: document.documentElement.classList.contains('dark') ? '#0f172a' : '#fff',
    color: document.documentElement.classList.contains('dark') ? '#fff' : '#000',
  })
  if (result.isConfirmed) {
    try {
      await employerStore.deleteJob(id)
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Job deleted',
        showConfirmButton: false,
        timer: 2000,
      })
    } catch (err) {
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'error',
        title: err.response?.data?.message || 'Failed to delete job',
        showConfirmButton: false,
        timer: 3000,
      })
    }
  }
}
</script>
