<template>
  <div
    class="min-h-screen bg-[#FAFAFA] dark:bg-slate-950 py-20 px-6 lg:px-12 font-['Plus_Jakarta_Sans',sans-serif]"
  >
    <div class="max-w-7xl mx-auto text-center mb-16 animate-[fadeIn_0.6s_ease-out]">
      <div
        class="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-full mb-5 border border-indigo-100 dark:border-indigo-500/20"
      >
        <span
          class="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.3em]"
          >Industry Clusters</span
        >
      </div>
      <h1
        class="text-5xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tighter italic leading-tight mb-4"
      >
        Browse by<span class="text-indigo-600">.</span>Category
      </h1>
      <p
        class="text-slate-500 dark:text-slate-400 font-bold text-lg max-w-lg mx-auto leading-relaxed"
      >
        Select your specialization to find the
        <span
          class="text-slate-900 dark:text-white underline decoration-indigo-500/30 decoration-4 italic"
          >perfect technical match</span
        >.
      </p>
    </div>

    <div class="max-w-7xl mx-auto">
      <div v-if="jobStore.loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div
          v-for="i in 8"
          :key="i"
          class="h-48 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] animate-pulse"
        ></div>
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div
          v-for="cat in jobStore.categories"
          :key="cat.id"
          @click="goToCategory(cat.id)"
          class="group relative bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-8 rounded-[2.5rem] text-center transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl hover:shadow-indigo-500/5 cursor-pointer overflow-hidden flex flex-col items-center justify-center"
        >
          <div
            class="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
          ></div>

          <div
            class="w-20 h-20 bg-slate-50 dark:bg-slate-800/50 rounded-[1.5rem] flex items-center justify-center mb-6 border border-transparent group-hover:bg-indigo-600 group-hover:rotate-[-10deg] group-hover:scale-110 shadow-sm transition-all duration-500"
          >
            <i
              :class="cat.icon || 'pi pi-folder'"
              class="text-3xl text-slate-300 group-hover:text-white transition-colors duration-500"
            ></i>
          </div>

          <h3
            class="text-xl font-black text-slate-900 dark:text-white tracking-tight group-hover:text-indigo-600 transition-colors mb-4"
          >
            {{ cat.name }}
          </h3>

          <div
            class="inline-flex items-center gap-2 px-4 py-1.5 bg-slate-50 dark:bg-slate-800 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-500/10 rounded-full border border-slate-100 dark:border-slate-700 group-hover:border-indigo-100 transition-all"
          >
            <span
              class="text-[10px] font-black text-indigo-600 dark:text-indigo-400 tracking-widest"
            >
              {{ jobStore.jobCountByCategory(cat.id) }} JOBS
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useJobsStore } from '../stores/jobs.js'
import { useRouter } from 'vue-router'

const jobStore = useJobsStore()
const router = useRouter()

onMounted(() => {
  jobStore.initialize()
})

const goToCategory = (id) => {
  router.push({ name: 'jobs', query: { categoryId: id } })
}
</script>

<style>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
