<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'

const props = defineProps({
  job: { type: Object, required: true },
})

const router = useRouter()
const authStore = useAuthStore()

const isGuest = computed(() => !authStore.isAuthenticated)

const handleApply = () => {
  if (isGuest.value) {
    router.push({
      name: 'login',
      query: { redirect: `/apply/${props.job.id}` },
    })
  } else {
    router.push({ name: 'jobs.apply', params: { id: props.job.id } })
  }
}
</script>

<template>
  <div
    class="group relative bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/50 p-7 rounded-[2.5rem] shadow-[0_10px_40px_-15px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_60px_-15px_rgba(79,70,229,0.1)] hover:-translate-y-2 transition-all duration-500 flex flex-col justify-between overflow-hidden font-['Outfit',sans-serif]"
  >
    <div
      class="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/5 blur-[80px] group-hover:bg-indigo-500/10 transition-colors duration-500"
    ></div>

    <div>
      <div class="flex justify-between items-start mb-8">
        <div
          class="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-[1.5rem] flex items-center justify-center border border-slate-100 dark:border-slate-700 shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-all duration-500"
        >
          <span class="text-2xl font-black text-indigo-600 dark:text-indigo-400 uppercase italic">
            {{ job.company_name?.charAt(0) || 'J' }}
          </span>
        </div>

        <span
          class="px-4 py-2 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl border border-indigo-100/50 dark:border-indigo-500/20"
        >
          {{ job.type || 'Full Time' }}
        </span>
      </div>

      <h3
        class="text-2xl font-black text-slate-900 dark:text-white tracking-tighter leading-tight mb-3 group-hover:text-indigo-600 transition-colors duration-300"
      >
        {{ job.title }}
      </h3>

      <div class="flex items-center gap-2 mb-6">
        <span
          class="text-slate-900 dark:text-slate-300 font-black text-sm uppercase tracking-tight italic"
          >{{ job.company_name }}</span
        >
        <span class="w-1 h-1 bg-slate-300 rounded-full"></span>
        <span class="text-slate-400 dark:text-slate-500 font-bold text-sm">{{ job.location }}</span>
      </div>

      <div class="flex flex-wrap gap-2 mb-10">
        <div
          class="flex items-center gap-1.5 px-4 py-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-colors cursor-default"
        >
          <i class="pi pi-wallet text-indigo-500 text-[10px]"></i>
          <span
            class="text-[11px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-wider"
          >
            {{ job.salary_range || 'Competitive' }}
          </span>
        </div>
        <div
          class="flex items-center gap-1.5 px-4 py-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-colors cursor-default"
        >
          <i class="pi pi-tag text-indigo-500 text-[10px]"></i>
          <span
            class="text-[11px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-wider"
          >
            {{ job.category || 'Tech' }}
          </span>
        </div>
      </div>
    </div>

    <div class="flex items-center gap-3 pt-8 border-t border-slate-50 dark:border-slate-800/50">
      <button
        @click="handleApply"
        class="flex-1 py-4 bg-slate-900 dark:bg-indigo-600 text-white text-xs font-black uppercase tracking-[0.2em] rounded-[1.25rem] hover:bg-indigo-600 dark:hover:bg-indigo-700 active:scale-95 transition-all shadow-xl shadow-indigo-600/10 group-hover:shadow-indigo-600/20"
      >
        {{ isGuest ? 'Login to Apply' : 'Apply Now' }}
      </button>

      <router-link
        :to="{ name: 'job.detail', params: { id: job.id } }"
        class="p-4 bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 rounded-[1.25rem] hover:bg-slate-900 dark:hover:bg-white hover:text-white dark:hover:text-slate-900 transition-all group/btn shadow-sm"
      >
        <i
          class="pi pi-arrow-up-right text-sm group-hover/btn:rotate-45 transition-transform duration-300"
        ></i>
      </router-link>
    </div>
  </div>
</template>
