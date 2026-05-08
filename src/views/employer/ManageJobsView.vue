<template>
  <div class="space-y-10">
    <div class="flex justify-between items-end">
      <div>
        <h2 class="text-3xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">
          Managed <span class="text-indigo-600">Listings.</span>
        </h2>
        <p class="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] mt-2">
          Edit or update your published positions
        </p>
      </div>
      <router-link
        :to="{ name: 'job-create' }"
        class="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl hover:bg-indigo-600 transition-all active:scale-95"
      >
        + Post New Job
      </router-link>
    </div>

    <div v-if="employerStore.loading" class="grid grid-cols-1 gap-4">
      <div
        v-for="i in 3"
        :key="i"
        class="h-32 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-[2rem]"
      ></div>
    </div>

    <div v-else class="grid grid-cols-1 gap-6">
      <div
        v-for="job in employerStore.myJobs"
        :key="job.id"
        class="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 flex items-center justify-between group hover:border-indigo-100 transition-all shadow-sm"
      >
        <div class="flex items-center gap-8">
          <div
            class="w-16 h-16 bg-slate-50 dark:bg-slate-800/50 rounded-[1.5rem] flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500"
          >
            <i class="pi pi-briefcase text-2xl"></i>
          </div>
          <div>
            <h4
              class="font-black text-slate-900 dark:text-white uppercase tracking-tight text-lg mb-1"
            >
              {{ job.title }}
            </h4>
            <div
              class="flex items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest"
            >
              <span>{{ job.category?.name || 'Category' }}</span>
              <span class="w-1 h-1 bg-slate-200 rounded-full"></span>
              <span class="text-emerald-500">{{ job.applications_count || 0 }} Applications</span>
            </div>
          </div>
        </div>

        <div class="flex items-center gap-4">
          <button
            class="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
          >
            <i class="pi pi-pencil"></i>
          </button>
          <button
            class="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all"
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
import { useEmployerStore } from '@/stores/EmployerStore'

const employerStore = useEmployerStore()
onMounted(() => employerStore.fetchMyJobs())
</script>
