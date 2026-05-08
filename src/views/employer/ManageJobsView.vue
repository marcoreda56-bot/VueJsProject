<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <h2 class="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
        My <span class="text-indigo-600 italic">Postings</span>
      </h2>
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
        class="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 flex items-center justify-between group hover:border-indigo-200 transition-all shadow-sm"
      >
        <div class="flex items-center gap-4">
          <div
            class="w-14 h-14 bg-indigo-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-indigo-600 font-black text-xl group-hover:bg-indigo-600 group-hover:text-white transition-all"
          >
            {{ job.title.charAt(0) }}
          </div>
          <div>
            <h3
              class="font-black text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors"
            >
              {{ job.title }}
            </h3>
            <div
              class="flex gap-3 text-[10px] font-bold text-slate-400 uppercase mt-1 tracking-widest"
            >
              <span><i class="pi pi-map-marker"></i> {{ job.city }}</span>
              <span class="text-indigo-200">|</span>
              <span
                ><i class="pi pi-calendar"></i>
                {{ new Date(job.created_at).toLocaleDateString() }}</span
              >
            </div>
          </div>
        </div>

        <div class="flex items-center gap-4">
          <!-- Status -->
          <span
            :class="getStatusClass(job.status)"
            class="text-[9px] font-black px-4 py-1.5 rounded-full uppercase"
          >
            {{ job.status }}
          </span>

          <!-- Actions -->
          <div class="flex gap-2">
            <!-- تم الإبقاء على زر التعديل فقط -->
            <button
              @click="router.push(`/employer/edit-job/${job.id}`)"
              class="w-10 h-10 rounded-xl hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 flex items-center justify-center transition-all"
              title="Edit Job"
            >
              <i class="pi pi-pencil text-sm"></i>
            </button>
          </div>
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
import { useRouter } from 'vue-router'

const employerStore = useEmployerStore()
const router = useRouter()

onMounted(() => employerStore.fetchMyJobs())

const getStatusClass = (status) => {
  const styles = {
    active: 'bg-emerald-50 text-emerald-600',
    draft: 'bg-slate-100 text-slate-500',
    pending_review: 'bg-amber-50 text-amber-600',
    rejected: 'bg-rose-50 text-rose-600',
    closed: 'bg-slate-200 text-slate-700',
    expired: 'bg-orange-50 text-orange-600',
  }
  return styles[status] || 'bg-blue-50 text-blue-600'
}
</script>
