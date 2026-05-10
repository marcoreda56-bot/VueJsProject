<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6 text-gray-800 dark:text-white">My Applications</h1>

    <div v-if="candidateStore.loading" class="space-y-4">
      <div v-for="i in 3" :key="i" class="h-24 bg-gray-100 dark:bg-slate-800 animate-pulse rounded-xl"></div>
    </div>

    <div
      v-else-if="candidateStore.applications.length === 0"
      class="bg-white dark:bg-slate-900 text-center py-20 rounded-xl border dark:border-slate-800"
    >
      <p class="text-gray-500 dark:text-slate-400">You haven't applied for any jobs yet.</p>
      <router-link to="/jobs" class="text-blue-600 font-medium mt-2 inline-block"
        >Browse Jobs</router-link
      >
    </div>

    <div v-else class="space-y-4">
      <div
        v-for="app in candidateStore.applications"
        :key="app.id"
        class="bg-white dark:bg-slate-900 p-5 rounded-xl shadow-sm border dark:border-slate-800 flex flex-col md:flex-row justify-between md:items-center gap-4 cursor-pointer hover:shadow-md transition-all"
        @click="$router.push(`/candidate/applications/${app.id}`)"
      >
        <div>
          <h3 class="font-bold text-lg text-gray-900 dark:text-white">{{ app.job_snapshot?.title }}</h3>
          <p class="text-gray-600 dark:text-slate-400">{{ app.employer_snapshot?.company_name }}</p>
          <p class="text-xs text-gray-400 dark:text-slate-500 mt-1">
            Applied on: {{ new Date(app.applied_at || app.created_at).toLocaleDateString() }}
          </p>
        </div>

        <div class="flex items-center gap-6">
          <div class="text-right">
            <span :class="statusClass(app.current_status || app.status)">{{ (app.current_status || app.status)?.replace('_', ' ') }}</span>
          </div>

          <button
            v-if="canWithdraw(app.current_status || app.status)"
            @click.stop="openWithdrawModal(app.id)"
            class="text-red-600 hover:text-red-700 text-sm font-medium transition"
          >
            Withdraw
          </button>
        </div>
      </div>
    </div>

    <!-- Withdraw Modal -->
    <div
      v-if="withdrawModal.open"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
      @click.self="withdrawModal.open = false"
    >
      <div class="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 max-w-md w-full shadow-2xl">
        <h2 class="text-2xl font-black text-slate-900 dark:text-white mb-2">Withdraw Application</h2>
        <p class="text-slate-500 dark:text-slate-400 mb-6 text-sm">
          Are you sure? This cannot be undone. Your application will be permanently withdrawn.
        </p>

        <div class="mb-6">
          <label class="block text-sm font-black text-slate-400 uppercase mb-2">Reason (optional)</label>
          <textarea
            v-model="withdrawModal.reason"
            rows="3"
            class="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 ring-indigo-500 outline-none text-sm dark:text-white"
            placeholder="Tell us why you're withdrawing..."
          ></textarea>
        </div>

        <div class="flex gap-3">
          <button
            @click="withdrawModal.open = false"
            class="flex-1 py-3 text-slate-400 font-bold text-xs uppercase tracking-widest hover:text-slate-900 transition-colors"
          >
            Cancel
          </button>
          <button
            @click="confirmWithdraw"
            :disabled="candidateStore.loading"
            class="flex-1 py-3 bg-rose-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-rose-700 transition-all disabled:bg-slate-300"
          >
            Confirm Withdraw
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive } from 'vue'
import { useCandidateStore } from '@/stores/CandidateStore'

const candidateStore = useCandidateStore()

const withdrawModal = reactive({
  open: false,
  applicationId: null,
  reason: '',
})

onMounted(() => candidateStore.fetchApplications())

const canWithdraw = (status) => {
  const allowed = ['applied', 'reviewed', 'shortlisted', 'interviewed', 'offered']
  return allowed.includes(status)
}

const openWithdrawModal = (id) => {
  withdrawModal.applicationId = id
  withdrawModal.reason = ''
  withdrawModal.open = true
}

const confirmWithdraw = async () => {
  try {
    await candidateStore.withdrawApplication(withdrawModal.applicationId, withdrawModal.reason)
    withdrawModal.open = false
  } catch (err) {
    alert(err.response?.data?.message || 'Failed to withdraw application')
  }
}

const statusClass = (status) => {
  const base = 'px-3 py-1 rounded-full text-sm font-semibold capitalize'
  const colors = {
    applied: 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400',
    reviewed: 'bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400',
    shortlisted: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400',
    interviewed: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400',
    offered: 'bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400',
    hired: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400',
    rejected: 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400',
    withdrawn: 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400',
    job_removed: 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500',
  }
  return `${base} ${colors[status] || colors.applied}`
}
</script>
