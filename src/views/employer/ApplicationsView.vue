<script setup>
import { ref, onMounted } from 'vue'
import { useEmployerStore } from '@/stores/EmployerStore'

const employerStore = useEmployerStore()

const showInterviewModal = ref(false)
const selectedAppId = ref(null)
const interviewData = ref({
  interview_date: '',
  location: '',
  notes: '',
})

onMounted(() => {
  employerStore.fetchApplications()
})

const updateStatus = async (appId, newStatus) => {
  try {
    await employerStore.updateApplicationStatus(appId, newStatus)
    alert(`Application marked as ${newStatus}`)
  } catch (err) {
    alert('Failed to update status')
  }
}

const openInterviewModal = (appId) => {
  selectedAppId.value = appId
  showInterviewModal.value = true
}

const confirmInterview = async () => {
  try {
    await employerStore.scheduleInterview(selectedAppId.value, interviewData.value)
    showInterviewModal.value = false
    interviewData.value = { interview_date: '', location: '', notes: '' }
    alert('Interview Scheduled Successfully!')
  } catch (err) {
    alert('Error scheduling interview')
  }
}

const getStatusColor = (status) => {
  const colors = {
    accepted: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
    rejected: 'text-red-500 bg-red-500/10 border-red-500/20',
    pending: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
  }
  return colors[status] || 'text-slate-400 bg-slate-400/10'
}
</script>

<template>
  <div class="min-h-screen bg-[#FAFAFA] dark:bg-slate-950 font-['Outfit'] p-6 md:p-12">
    <div class="max-w-7xl mx-auto">
      <header class="mb-16">
        <h1 class="text-5xl font-black text-slate-900 dark:text-white tracking-tighter italic mb-2">
          Talent <span class="text-indigo-600">Pipeline.</span>
        </h1>
        <p class="text-slate-400 font-medium text-lg">
          Review and manage candidates applying for your positions.
        </p>
      </header>

      <div class="grid grid-cols-1 gap-6">
        <!-- Application Card -->
        <div
          v-for="app in employerStore.applications"
          :key="app.id"
          class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] p-8 flex flex-col md:flex-row items-center justify-between gap-8 hover:shadow-2xl hover:shadow-indigo-500/5 transition-all group"
        >
          <div class="flex items-center gap-6 w-full md:w-auto">
            <div
              class="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center overflow-hidden border border-slate-100 dark:border-slate-700"
            >
              <img
                :src="`https://ui-avatars.com/api/?name=${app.candidate.name}&background=6366f1&color=fff`"
                class="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 class="text-2xl font-black text-slate-900 dark:text-white tracking-tighter mb-1">
                {{ app.candidate.name }}
              </h3>
              <p class="text-indigo-600 font-bold text-sm mb-2">
                Applied for: <span class="text-slate-400 italic">{{ app.job.title }}</span>
              </p>
              <div class="flex items-center gap-3">
                <span
                  :class="getStatusColor(app.status)"
                  class="px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border"
                >
                  {{ app.status }}
                </span>
                <span class="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                  <i class="pi pi-calendar mr-1"></i>
                  {{ new Date(app.created_at).toLocaleDateString() }}
                </span>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div
            class="flex flex-wrap items-center gap-4 w-full md:w-auto border-t md:border-t-0 pt-6 md:pt-0 border-slate-50 dark:border-slate-800"
          >
            <!-- View CV -->
            <a
              :href="app.candidate.resume_url"
              target="_blank"
              class="flex-1 md:flex-none px-6 py-4 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all flex items-center justify-center gap-2"
            >
              <i class="pi pi-file-pdf"></i> CV
            </a>

            <!-- Schedule Interview (Only shown if pending or accepted) -->
            <button
              v-if="app.status !== 'rejected'"
              @click="openInterviewModal(app.id)"
              class="flex-1 md:flex-none px-6 py-4 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all flex items-center justify-center gap-2"
            >
              <i class="pi pi-clock"></i> Interview
            </button>

            <!-- Accept/Reject Quick Buttons -->
            <div class="flex gap-2 w-full md:w-auto">
              <button
                @click="updateStatus(app.id, 'accepted')"
                class="flex-1 md:w-12 md:h-12 bg-emerald-500 text-white rounded-xl flex items-center justify-center hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20"
                title="Accept"
              >
                <i class="pi pi-check"></i>
              </button>
              <button
                @click="updateStatus(app.id, 'rejected')"
                class="flex-1 md:w-12 md:h-12 bg-red-500 text-white rounded-xl flex items-center justify-center hover:bg-red-600 transition-all shadow-lg shadow-red-500/20"
                title="Reject"
              >
                <i class="pi pi-times"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div
          v-if="!employerStore.loading && employerStore.applications.length === 0"
          class="py-32 text-center bg-white dark:bg-slate-900 rounded-[3rem] border-2 border-dashed border-slate-100 dark:border-slate-800"
        >
          <i class="pi pi-users text-slate-200 text-5xl mb-6 block"></i>
          <p class="text-slate-400 font-black uppercase tracking-[0.2em] text-xs">
            No applications to review yet
          </p>
        </div>
      </div>
    </div>

    <!-- Interview Modal Overlay -->
    <div
      v-if="showInterviewModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-6"
    >
      <div
        class="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[3rem] p-10 border border-slate-100 dark:border-slate-800 shadow-2xl animate-[fadeIn_0.3s_ease-out]"
      >
        <h3 class="text-2xl font-black italic mb-6">
          Schedule <span class="text-indigo-600">Interview</span>
        </h3>

        <div class="space-y-6">
          <div>
            <label
              class="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2 ml-2"
              >Date & Time</label
            >
            <input
              v-model="interviewData.interview_date"
              type="datetime-local"
              class="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none font-bold focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>

          <div>
            <label
              class="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2 ml-2"
              >Meeting Link / Address</label
            >
            <input
              v-model="interviewData.location"
              type="text"
              placeholder="Zoom link or Office location"
              class="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none font-bold focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>

          <div>
            <label
              class="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2 ml-2"
              >Additional Notes</label
            >
            <textarea
              v-model="interviewData.notes"
              rows="3"
              placeholder="Any instructions for the candidate..."
              class="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none font-bold focus:ring-2 focus:ring-indigo-500 transition-all"
            ></textarea>
          </div>

          <div class="flex gap-4 pt-4">
            <button
              @click="showInterviewModal = false"
              class="flex-1 py-4 font-black uppercase text-xs tracking-widest text-slate-400 hover:text-slate-600 transition-colors"
            >
              Cancel
            </button>
            <button
              @click="confirmInterview"
              :disabled="employerStore.loading"
              class="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-indigo-600/20 active:scale-95 transition-all"
            >
              {{ employerStore.loading ? 'Sending...' : 'Confirm' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
