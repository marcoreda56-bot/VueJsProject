<template>
  <div class="font-['Plus_Jakarta_Sans',sans-serif]">
    <header class="mb-10">
      <h1 class="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white">Job Categories</h1>
      <p class="mt-3 text-slate-500 dark:text-slate-400 max-w-2xl">
        Choose a category to see matching opportunities and narrow your search.
      </p>
    </header>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      <template v-if="loading">
        <div
          v-for="i in 8"
          :key="i"
          class="h-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 flex flex-col items-center justify-center space-y-4 animate-pulse"
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
          class="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-sky-200 dark:hover:border-sky-700 cursor-pointer flex flex-col items-center justify-center overflow-hidden"
        >
          <div
            class="w-16 h-16 bg-sky-50 dark:bg-sky-900/20 rounded-2xl flex items-center justify-center mb-5 border border-transparent group-hover:bg-sky-600 transition-all duration-300"
          >
            <i
              :class="cat.icon || 'pi pi-tag'"
              class="text-2xl text-sky-700 dark:text-sky-300 group-hover:text-white transition-colors duration-300"
            ></i>
          </div>

          <h3
            class="text-lg font-black text-slate-900 dark:text-white tracking-tight mb-2 group-hover:text-sky-700 dark:group-hover:text-sky-300 transition-colors"
          >
            {{ cat.name }}
          </h3>

          <div
            class="mt-2 px-4 py-1.5 bg-slate-50 dark:bg-slate-800 rounded-full border border-slate-100 dark:border-slate-700"
          >
            <span
              class="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest"
            >
              Explore now
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
  router.push({ name: 'public.category-jobs', params: { id } })
}

onMounted(fetchAllCategories)
</script>
