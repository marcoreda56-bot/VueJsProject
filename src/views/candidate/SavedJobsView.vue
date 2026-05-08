<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6 text-gray-800">Saved Jobs</h1>

    <div
      v-if="candidateStore.savedJobs.length === 0"
      class="bg-white text-center py-20 rounded-xl border"
    >
      <p class="text-gray-500">Your wishlist is empty.</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div
        v-for="saved in candidateStore.savedJobs"
        :key="saved.id"
        class="bg-white p-5 rounded-xl shadow-sm border border-gray-100 relative group"
      >
        <div class="mb-4">
          <h3 class="font-bold text-gray-900 group-hover:text-blue-600 transition">
            {{ saved.job?.title }}
          </h3>
          <p class="text-sm text-gray-500">{{ saved.job?.employer?.company_name }}</p>
        </div>

        <div class="flex justify-between items-center mt-6">
          <router-link :to="`/jobs/${saved.job?.slug}`" class="text-sm font-medium text-blue-600">
            View Details
          </router-link>

          <button
            @click="candidateStore.toggleSaveJob(saved.job_id)"
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
