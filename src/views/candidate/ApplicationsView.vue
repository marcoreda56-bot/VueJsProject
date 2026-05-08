<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6 text-gray-800">My Applications</h1>

    <div v-if="candidateStore.loading" class="space-y-4">
      <div v-for="i in 3" :key="i" class="h-24 bg-gray-100 animate-pulse rounded-xl"></div>
    </div>

    <div
      v-else-if="candidateStore.applications.length === 0"
      class="bg-white text-center py-20 rounded-xl border"
    >
      <p class="text-gray-500">You haven't applied for any jobs yet.</p>
      <router-link to="/jobs" class="text-blue-600 font-medium mt-2 inline-block"
        >Browse Jobs</router-link
      >
    </div>

    <div v-else class="space-y-4">
      <div
        v-for="app in candidateStore.applications"
        :key="app.id"
        class="bg-white p-5 rounded-xl shadow-sm border flex flex-col md:flex-row justify-between md:items-center gap-4"
      >
        <div>
          <h3 class="font-bold text-lg text-gray-900">{{ app.job?.title }}</h3>
          <p class="text-gray-600">{{ app.job?.employer?.company_name }}</p>
          <p class="text-xs text-gray-400 mt-1">
            Applied on: {{ new Date(app.created_at).toLocaleDateString() }}
          </p>
        </div>

        <div class="flex items-center gap-6">
          <div class="text-right">
            <span :class="statusClass(app.status)">{{ app.status }}</span>
          </div>

          <button
            v-if="app.status === 'pending'"
            @click="cancelApplication(app.id)"
            class="text-red-600 hover:text-red-700 text-sm font-medium transition"
          >
            Withdraw
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

onMounted(() => candidateStore.fetchApplications())

const cancelApplication = async (id) => {
  if (confirm('Are you sure you want to withdraw this application?')) {
    await candidateStore.withdrawApplication(id)
  }
}

const statusClass = (status) => {
  const base = 'px-3 py-1 rounded-full text-sm font-semibold capitalize'
  const colors = {
    pending: 'bg-yellow-50 text-yellow-700',
    accepted: 'bg-green-50 text-green-700',
    rejected: 'bg-red-50 text-red-700',
    withdrawn: 'bg-gray-100 text-gray-500',
  }
  return `${base} ${colors[status] || colors.pending}`
}
</script>
