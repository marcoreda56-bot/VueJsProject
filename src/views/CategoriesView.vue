<template>
  <div
    class="min-h-screen bg-[#FAFAFA] dark:bg-slate-950 py-16 px-6 lg:px-12 font-['Plus_Jakarta_Sans',sans-serif]"
  >
    <div class="max-w-7xl mx-auto text-center mb-16 animate-[fadeIn_0.6s_ease-out]">
      <div
        class="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-full mb-4 border border-indigo-100 dark:border-indigo-500/20"
      >
        <span
          class="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.2em]"
          >Tech Ecosystem</span
        >
      </div>
      <h1
        class="text-5xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tighter italic leading-none mb-4"
      >
        Explore<span class="text-indigo-600">.</span>Categories
      </h1>
      <p class="text-slate-500 dark:text-slate-400 font-bold text-lg max-w-md mx-auto">
        Find your niche and browse jobs by your
        <span class="text-indigo-600 italic">technical expertise</span>.
      </p>
    </div>

    <div class="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      <template v-if="loading">
        <div
          v-for="i in 8"
          :key="i"
          class="h-64 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] p-8 flex flex-col items-center justify-center space-y-4 animate-pulse"
        >
          <div class="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl"></div>
          <div class="h-6 w-3/4 bg-slate-100 dark:bg-slate-800 rounded-lg"></div>
          <div class="h-4 w-1/2 bg-slate-50 dark:bg-slate-800 rounded-full"></div>
        </div>
      </template>

      <template v-else>
        <div
          v-for="cat in categories"
          :key="cat.id"
          @click="goToCategory(cat.id)"
          class="group relative bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-8 rounded-[2.5rem] text-center transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl hover:shadow-indigo-500/5 cursor-pointer flex flex-col items-center justify-center overflow-hidden"
        >
          <div
            class="absolute -bottom-12 -right-12 w-24 h-24 bg-indigo-500/5 blur-3xl group-hover:bg-indigo-500/20 transition-all duration-500"
          ></div>

          <div
            class="w-20 h-20 bg-slate-50 dark:bg-slate-800/50 rounded-[1.5rem] flex items-center justify-center mb-6 border border-transparent group-hover:bg-indigo-600 group-hover:rotate-[-8deg] group-hover:scale-110 shadow-sm transition-all duration-500"
          >
            <i
              :class="cat.icon || 'pi pi-tag'"
              class="text-3xl text-slate-300 group-hover:text-white transition-colors duration-500"
            ></i>
          </div>

          <h3
            class="text-xl font-black text-slate-900 dark:text-white tracking-tight mb-2 group-hover:text-indigo-600 transition-colors"
          >
            {{ cat.name }}
          </h3>

          <div
            class="mt-4 px-4 py-1.5 bg-slate-50 dark:bg-slate-800 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-500/10 rounded-full border border-slate-100 dark:border-slate-700 group-hover:border-indigo-100 dark:group-hover:border-indigo-500/20 transition-all"
          >
            <span
              class="text-[10px] font-black text-slate-400 dark:text-slate-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 uppercase tracking-widest transition-colors"
            >
              Explore Now
            </span>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { categoriesApi } from '../api/api'

const router = useRouter()
const categories = ref([])
const loading = ref(true)

const fetchAllCategories = async () => {
  try {
    const res = await categoriesApi.getAll()
    categories.value = res.data
  } catch (err) {
    console.error('Failed to load categories:', err)
  } finally {
    loading.value = false
  }
}

const goToCategory = (id) => {
  router.push(`/categories/${id}`)
}

onMounted(() => {
  fetchAllCategories()
})
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
