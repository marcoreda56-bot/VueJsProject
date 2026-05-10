<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4">
    <div class="max-w-6xl mx-auto space-y-8">
      <div class="text-center mb-10">
        <h1 class="text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic mb-3">
          Browse <span class="text-indigo-600">Companies.</span>
        </h1>
        <p class="text-slate-400 font-medium">Discover great places to work</p>
      </div>

      <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="i in 6" :key="i" class="h-40 bg-white dark:bg-slate-900 rounded-[2rem] animate-pulse"></div>
      </div>

      <div v-else-if="employers.length === 0" class="text-center py-20">
        <div class="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <i class="pi pi-building text-slate-300 text-2xl"></i>
        </div>
        <p class="text-slate-400 font-bold">No employers found.</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <router-link
          v-for="emp in employers"
          :key="emp.id"
          :to="`/employers/${emp.slug}`"
          class="bg-white dark:bg-slate-900 rounded-[2rem] p-8 shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-xl transition-all group"
        >
          <div class="flex items-start gap-4">
            <div class="w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border p-2 flex items-center justify-center flex-shrink-0">
              <img
                :src="getFileUrl(emp.logo) || '/default-logo.png'"
                class="max-w-full max-h-full object-contain"
                alt="Company logo"
              />
            </div>
            <div class="flex-1 min-w-0">
              <h3 class="font-bold text-lg text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors truncate">
                {{ emp.company_name }}
              </h3>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">{{ emp.industry }}</p>
              <div class="flex items-center gap-3 mt-3">
                <span v-if="emp.is_verified" class="text-[10px] font-black text-emerald-600 uppercase flex items-center gap-1">
                  <i class="pi pi-verified"></i> Verified
                </span>
                <span v-if="emp.rating" class="text-[10px] font-black text-amber-500 uppercase flex items-center gap-1">
                  <i class="pi pi-star-fill"></i> {{ emp.rating }}
                </span>
                <span class="text-[10px] font-black text-slate-400 uppercase">
                  {{ emp.reviews_count || 0 }} reviews
                </span>
              </div>
            </div>
          </div>
          <p v-if="emp.description" class="text-sm text-slate-500 dark:text-slate-400 mt-4 line-clamp-2">
            {{ emp.description }}
          </p>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { publicApi, getFileUrl } from '@/api/services/api'

const employers = ref([])
const loading = ref(false)

onMounted(async () => {
  loading.value = true
  try {
    employers.value = await publicApi.getEmployers()
  } catch (err) {
    console.error('Failed to load employers', err)
  } finally {
    loading.value = false
  }
})
</script>
