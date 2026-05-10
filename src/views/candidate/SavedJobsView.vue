<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Saved Jobs</h1>

    <div
      v-if="candidateStore.savedJobs.length === 0"
      class="bg-white dark:bg-slate-900 text-center py-20 rounded-xl border dark:border-slate-800"
    >
      <p class="text-gray-500 dark:text-slate-400">Your wishlist is empty.</p>
      <router-link to="/jobs" class="text-blue-600 font-medium mt-2 inline-block"
        >Browse Jobs</router-link
      >
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div
        v-for="saved in candidateStore.savedJobs"
        :key="saved.id"
        class="bg-white dark:bg-slate-900 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 relative group"
      >
        <div class="mb-4">
          <h3 class="font-bold text-gray-900 dark:text-white group-hover:text-blue-600 transition">
            {{ saved.job?.title }}
          </h3>
          <p class="text-sm text-gray-500 dark:text-slate-400">{{ saved.job?.employer?.company_name }}</p>
          <p v-if="saved.notes" class="text-xs text-gray-400 dark:text-slate-500 mt-2 italic">
            Note: {{ saved.notes }}
          </p>
        </div>

        <div class="flex justify-between items-center mt-6">
          <router-link :to="`/jobs/${saved.job?.slug || saved.job?.id}`" class="text-sm font-medium text-blue-600">
            View Details
          </router-link>

          <button
            @click="candidateStore.unsaveJob(saved.job_id)"
            class="text-gray-400 hover:text-red-500 transition"
          >
            <span class="text-xs">Remove</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useCandidateStore } from '@/stores/CandidateStore'

const candidateStore = useCandidateStore()

onMounted(() => candidateStore.fetchSavedJobs())
</script>
