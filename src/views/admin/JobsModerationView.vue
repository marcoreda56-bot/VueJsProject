<template>
  <div class="space-y-8 font-['Outfit']">
    <header>
      <h2 class="text-3xl font-black italic">
        Jobs <span class="text-indigo-600">Moderation.</span>
      </h2>
      <p class="text-gray-400 font-bold uppercase text-[10px] tracking-[0.2em]">
        Review and approve job postings
      </p>
    </header>

    <div class="grid grid-cols-1 gap-4">
      <div
        v-for="job in adminStore.jobs"
        :key="job.id"
        class="p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] flex items-center justify-between group"
      >
        <div class="flex items-center gap-6">
          <div
            class="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center font-black text-indigo-600"
          >
            {{ job.title.charAt(0) }}
          </div>
          <div>
            <h4 class="font-black text-slate-900 dark:text-white tracking-tighter">
              {{ job.title }}
            </h4>
            <p class="text-xs text-slate-400">
              Posted by
              <span class="text-indigo-600 font-bold">{{ job.employer?.company_name }}</span>
            </p>
          </div>
        </div>

        <div class="flex items-center gap-8">
          <div class="text-right hidden md:block">
            <p class="text-[10px] font-black uppercase text-slate-400 tracking-widest">Status</p>
            <span
              :class="job.status === 'active' ? 'text-emerald-500' : 'text-amber-500'"
              class="text-xs font-black uppercase italic"
            >
              {{ job.status }}
            </span>
          </div>
          <div class="flex gap-2">
            <button
              v-if="job.status === 'pending'"
              @click="adminStore.updateJobStatus(job.id, 'active')"
              class="px-6 py-3 bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20"
            >
              Approve
            </button>
            <button
              @click="adminStore.deleteJob(job.id)"
              class="p-3 text-red-400 hover:bg-red-50 rounded-xl transition-colors"
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
import { useAdminStore } from '@/stores/AdminStore'
const adminStore = useAdminStore()
</script>
