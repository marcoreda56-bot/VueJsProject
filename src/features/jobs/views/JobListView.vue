<script setup>
import { ref, onMounted } from 'vue'
import { jobsApi } from '@/services/api'
import JobCard from '../components/JobCard.vue'

const jobs = ref([])
const isLoading = ref(true)
const error = ref(null)

// 1. Fetch Jobs from API
const fetchJobs = async () => {
  isLoading.value = true
  try {
    const response = await jobsApi.getAll()
    jobs.value = response.data
  } catch (err) {
    error.value = 'Failed to load jobs. Please try again later.'
    console.error(err)
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchJobs)
</script>

<template>
  <div class="min-h-screen bg-[#FBFBFB] py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <div class="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <h1 class="text-4xl font-black text-gray-900 tracking-tighter mb-3">Explore Careers</h1>
          <p class="text-gray-500 font-medium text-lg">
            Find your next big opportunity in tech & design.
          </p>
        </div>

        <div class="flex gap-4">
          <div class="bg-white border border-gray-100 px-6 py-3 rounded-2xl shadow-sm">
            <span class="block text-2xl font-black text-gray-900">{{ jobs.length }}</span>
            <span class="text-[10px] font-black text-gray-400 uppercase tracking-widest"
              >Open Positions</span
            >
          </div>
        </div>
      </div>

      <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div
          v-for="i in 6"
          :key="i"
          class="h-[300px] bg-gray-100 animate-pulse rounded-[2rem]"
        ></div>
      </div>

      <div
        v-else-if="error"
        class="text-center py-20 bg-white rounded-[2.5rem] border-2 border-dashed border-gray-100"
      >
        <span class="text-4xl mb-4 block">🔌</span>
        <p class="text-gray-500 font-bold">{{ error }}</p>
        <button @click="fetchJobs" class="mt-4 text-black font-black underline">Try Again</button>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <JobCard v-for="job in jobs" :key="job.id" :job="job" />
      </div>

      <div v-if="!isLoading && jobs.length === 0" class="text-center py-20">
        <p class="text-gray-400 font-bold">No jobs found at the moment.</p>
      </div>
    </div>
  </div>
</template>
