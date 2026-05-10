<template>
  <div class="max-w-5xl mx-auto space-y-8 animate-fadeIn">
    <button
      @click="$router.back()"
      class="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors"
    >
      <i class="pi pi-arrow-left"></i> Back
    </button>

    <div v-if="employerStore.loading" class="flex justify-center py-20">
      <i class="pi pi-spin pi-spinner text-3xl text-indigo-600"></i>
    </div>

    <div v-else-if="application" class="space-y-8">
      <!-- Header -->
      <div class="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-slate-100 dark:border-slate-800">
        <div class="flex flex-col md:flex-row justify-between items-start gap-6">
          <div class="flex items-center gap-6">
            <img
              :src="application.candidate_snapshot?.avatar_url || `https://ui-avatars.com/api/?name=${application.candidate_snapshot?.first_name || 'U'}&background=6366f1&color=fff`"
              class="w-20 h-20 rounded-3xl object-cover"
            />
            <div>
              <h1 class="text-2xl font-black text-slate-900 dark:text-white">
                {{ application.candidate_snapshot?.first_name }} {{ application.candidate_snapshot?.last_name }}
              </h1>
              <p class="text-indigo-600 font-bold text-sm">
                Applied for: <span class="text-slate-400 italic">{{ application.job_snapshot?.title }}</span>
              </p>
              <p class="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">
                {{ application.job_snapshot?.location }} &bull; {{ application.job_snapshot?.type?.replace('_', ' ') }}
              </p>
            </div>
          </div>
          <div class="flex flex-col items-end gap-2">
            <span :class="statusClass(application.current_status)">
              {{ application.current_status?.replace('_', ' ') }}
            </span>
            <p class="text-xs text-slate-400 font-bold">
              Applied {{ formatDate(application.applied_at) }}
            </p>
          </div>
        </div>
      </div>

      <!-- Cover Letter -->
      <div v-if="application.cover_letter" class="bg-white dark:bg-slate-900 rounded-[2rem] p-8 shadow-sm border border-slate-100 dark:border-slate-800">
        <h3 class="font-black text-slate-900 dark:text-white uppercase tracking-widest text-xs mb-4">Cover Letter</h3>
        <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">{{ application.cover_letter }}</p>
      </div>

      <!-- Resume -->
      <div v-if="application.resume_url" class="bg-white dark:bg-slate-900 rounded-[2rem] p-8 shadow-sm border border-slate-100 dark:border-slate-800">
        <h3 class="font-black text-slate-900 dark:text-white uppercase tracking-widest text-xs mb-4">Submitted Resume</h3>
        <a
          :href="getFileUrl(application.resume_url)"
          target="_blank"
          class="inline-flex items-center gap-3 px-6 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 transition-all"
        >
          <i class="pi pi-file-pdf text-rose-500 text-xl"></i>
          View Resume
        </a>
      </div>

      <!-- Pipeline Controls -->
      <div class="bg-white dark:bg-slate-900 rounded-[2rem] p-8 shadow-sm border border-slate-100 dark:border-slate-800">
        <h3 class="font-black text-slate-900 dark:text-white uppercase tracking-widest text-xs mb-6">Pipeline Actions</h3>
        <div class="flex flex-wrap gap-3">
          <button
            v-for="action in availableActions"
            :key="action.status"
            @click="handleStatusChange(action.status)"
            class="px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all"
            :class="action.class"
          >
            <i :class="action.icon" class="mr-2"></i>
            {{ action.label }}
          </button>
        </div>
        <p v-if="application.current_status === 'rejected' || application.current_status === 'hired' || application.current_status === 'withdrawn'" class="text-sm text-slate-400 mt-4 font-bold">
          This application is in a final state. No further actions available.
        </p>
      </div>

      <!-- Interviews -->
      <div v-if="application.interviews && application.interviews.length > 0" class="bg-white dark:bg-slate-900 rounded-[2rem] p-8 shadow-sm border border-slate-100 dark:border-slate-800">
        <h3 class="font-black text-slate-900 dark:text-white uppercase tracking-widest text-xs mb-6">Interviews</h3>
        <div class="space-y-4">
          <div
            v-for="interview in application.interviews"
            :key="interview.id"
            class="p-5 rounded-2xl border"
            :class="interviewCardClass(interview)"
          >
            <div class="flex items-start justify-between">
              <div>
                <div class="flex items-center gap-3 mb-2">
                  <span class="text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest" :class="interviewStatusBadge(interview)">
                    {{ interviewStatusText(interview) }}
                  </span>
                  <span class="text-xs text-slate-400 font-bold">{{ interview.location_type?.replace('_', ' ') }}</span>
                </div>
                <p class="text-sm font-bold text-slate-800 dark:text-white">
                  <i class="pi pi-calendar mr-2 text-indigo-500"></i>
                  {{ formatDateTime(interview.scheduled_at) }}
                </p>
                <p v-if="interview.location_details" class="text-xs text-slate-500 mt-1">
                  <i class="pi pi-map-marker mr-1"></i> {{ interview.location_details }}
                </p>
                <p v-if="interview.notes" class="text-xs text-slate-500 mt-2 italic">"{{ interview.notes }}"</p>
              </div>
              <div class="flex items-center gap-2">
                <button
                  v-if="!interview.deleted_at && interview.status === 'scheduled'"
                  @click="openRescheduleModal(interview)"
                  class="px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-black uppercase text-slate-600 hover:bg-indigo-50 transition"
                >
                  Reschedule
                </button>
                <button
                  v-if="!interview.deleted_at && interview.status === 'scheduled'"
                  @click="cancelInterview(interview.id)"
                  class="px-3 py-2 bg-rose-50 text-rose-600 rounded-xl text-xs font-black uppercase hover:bg-rose-100 transition"
                >
                  Cancel
                </button>
                <button
                  v-if="!interview.deleted_at && interview.status === 'scheduled'"
                  @click="openOutcomeModal(interview)"
                  class="px-3 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-xs font-black uppercase hover:bg-emerald-100 transition"
                >
                  Outcome
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Schedule Interview Button: only visible when candidate is shortlisted -->
      <div
        v-if="application.current_status === 'shortlisted'"
        class="bg-white dark:bg-slate-900 rounded-[2rem] p-8 shadow-sm border border-slate-100 dark:border-slate-800"
      >
        <button
          @click="showInterviewModal = true"
          class="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20"
        >
          <i class="pi pi-calendar-plus mr-2"></i> Schedule Interview
        </button>
      </div>

      <!-- History Timeline -->
      <div class="bg-white dark:bg-slate-900 rounded-[2rem] p-8 shadow-sm border border-slate-100 dark:border-slate-800">
        <h3 class="font-black text-slate-900 dark:text-white uppercase tracking-widest text-xs mb-6">Application Timeline</h3>
        <div class="space-y-6">
          <div
            v-for="(entry, index) in application.history"
            :key="entry.id"
            class="relative pl-8"
            :class="{ 'opacity-50': entry.stage === 'withdrawn' || entry.stage === 'rejected' }"
          >
            <div class="absolute left-0 top-1 w-2 h-2 rounded-full" :class="historyDotClass(entry.stage)"></div>
            <div
              v-if="index < application.history.length - 1"
              class="absolute left-[3px] top-3 w-0.5 h-full bg-slate-100 dark:bg-slate-800"
            ></div>
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <p class="text-sm font-bold text-slate-900 dark:text-white">
                  {{ entry.label || entry.stage?.replace('_', ' ') }}
                </p>
                <p class="text-xs text-slate-500">
                  by {{ entry.actor_name }} ({{ entry.actor_role }})
                </p>
                <p v-if="entry.notes" class="text-xs text-slate-400 mt-1 italic">"{{ entry.notes }}"</p>
              </div>
              <span class="text-xs text-slate-400 font-bold whitespace-nowrap">{{ formatDateTime(entry.created_at) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-20">
      <p class="text-slate-400 font-bold">Application not found.</p>
    </div>

    <!-- Interview Modal -->
    <div v-if="showInterviewModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" @click.self="showInterviewModal = false">
      <div class="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[2.5rem] p-10 border border-slate-100 dark:border-slate-800 shadow-2xl max-h-[90vh] overflow-y-auto">
        <h3 class="text-2xl font-black text-slate-900 dark:text-white mb-6">Schedule Interview</h3>
        <div class="space-y-4">
          <div>
            <label class="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-2 ml-2">Date & Time</label>
            <input v-model="interviewForm.scheduled_at" type="datetime-local" class="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none font-bold focus:ring-2 focus:ring-indigo-500 transition-all" />
          </div>
          <div>
            <label class="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-2 ml-2">Location Type</label>
            <select v-model="interviewForm.location_type" class="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none font-bold focus:ring-2 focus:ring-indigo-500 transition-all">
              <option value="video_call">Video Call</option>
              <option value="phone">Phone</option>
              <option value="in_person">In Person</option>
            </select>
          </div>
          <div>
            <label class="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-2 ml-2">Location / Link</label>
            <input v-model="interviewForm.location_details" type="text" placeholder="Zoom link or Office address" class="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none font-bold focus:ring-2 focus:ring-indigo-500 transition-all" />
          </div>
          <div>
            <label class="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-2 ml-2">Notes</label>
            <textarea v-model="interviewForm.notes" rows="3" class="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none font-bold focus:ring-2 focus:ring-indigo-500 transition-all"></textarea>
          </div>
        </div>
        <div class="flex gap-4 pt-6">
          <button @click="showInterviewModal = false" class="flex-1 py-4 font-black uppercase text-xs tracking-widest text-slate-400 hover:text-slate-600 transition-colors">Cancel</button>
          <button @click="confirmInterview" :disabled="employerStore.loading" class="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-indigo-600/20 active:scale-95 transition-all disabled:bg-slate-300">
            {{ employerStore.loading ? 'Scheduling...' : 'Confirm' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Reschedule Modal -->
    <div v-if="showRescheduleModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" @click.self="showRescheduleModal = false">
      <div class="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[2.5rem] p-10 border border-slate-100 dark:border-slate-800 shadow-2xl">
        <h3 class="text-2xl font-black text-slate-900 dark:text-white mb-6">Reschedule Interview</h3>
        <div class="space-y-4">
          <div>
            <label class="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-2 ml-2">New Date & Time</label>
            <input v-model="rescheduleForm.scheduled_at" type="datetime-local" class="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none font-bold focus:ring-2 focus:ring-indigo-500 transition-all" />
          </div>
          <div>
            <label class="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-2 ml-2">Reason</label>
            <textarea v-model="rescheduleForm.reschedule_reason" rows="2" class="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none font-bold focus:ring-2 focus:ring-indigo-500 transition-all"></textarea>
          </div>
        </div>
        <div class="flex gap-4 pt-6">
          <button @click="showRescheduleModal = false" class="flex-1 py-4 font-black uppercase text-xs tracking-widest text-slate-400 hover:text-slate-600 transition-colors">Cancel</button>
          <button @click="confirmReschedule" :disabled="employerStore.loading" class="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-indigo-600/20 active:scale-95 transition-all disabled:bg-slate-300">
            {{ employerStore.loading ? 'Saving...' : 'Reschedule' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Outcome Modal -->
    <div v-if="showOutcomeModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" @click.self="showOutcomeModal = false">
      <div class="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[2.5rem] p-10 border border-slate-100 dark:border-slate-800 shadow-2xl">
        <h3 class="text-2xl font-black text-slate-900 dark:text-white mb-6">Interview Outcome</h3>
        <div class="space-y-4">
          <div>
            <label class="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-2 ml-2">Outcome</label>
            <select v-model="outcomeForm.status" class="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none font-bold focus:ring-2 focus:ring-indigo-500 transition-all">
              <option value="completed">Completed — Move to Offer</option>
              <option value="no_show">No Show</option>
            </select>
          </div>
          <div>
            <label class="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-2 ml-2">Notes</label>
            <textarea v-model="outcomeForm.notes" rows="2" class="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none font-bold focus:ring-2 focus:ring-indigo-500 transition-all"></textarea>
          </div>
        </div>
        <div class="flex gap-4 pt-6">
          <button @click="showOutcomeModal = false" class="flex-1 py-4 font-black uppercase text-xs tracking-widest text-slate-400 hover:text-slate-600 transition-colors">Cancel</button>
          <button @click="confirmOutcome" :disabled="employerStore.loading" class="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-indigo-600/20 active:scale-95 transition-all disabled:bg-slate-300">
            {{ employerStore.loading ? 'Saving...' : 'Save Outcome' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useEmployerStore } from '@/stores/EmployerStore'
import { getFileUrl } from '@/api/services/api'
import Swal from 'sweetalert2'

const route = useRoute()
const employerStore = useEmployerStore()
const application = computed(() => employerStore.currentApplication)

const showInterviewModal = ref(false)
const showRescheduleModal = ref(false)
const showOutcomeModal = ref(false)
const selectedInterviewId = ref(null)

const interviewForm = ref({
  scheduled_at: '',
  location_type: 'video_call',
  location_details: '',
  notes: '',
})

const rescheduleForm = ref({
  scheduled_at: '',
  reschedule_reason: '',
})

const outcomeForm = ref({
  status: 'completed',
  notes: '',
})

onMounted(async () => {
  try {
    await employerStore.fetchApplicationById(route.params.id)
  } catch (err) {
    console.error('Failed to load application', err)
  }
})

// Forward-only pipeline transitions per spec
const availableActions = computed(() => {
  const status = application.value?.current_status
  const actions = []
  if (status === 'applied') {
    actions.push({ status: 'reviewed', label: 'Mark Reviewed', icon: 'pi pi-eye', class: 'bg-purple-100 text-purple-700 hover:bg-purple-200' })
    actions.push({ status: 'shortlisted', label: 'Shortlist', icon: 'pi pi-star', class: 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200' })
    actions.push({ status: 'rejected', label: 'Reject', icon: 'pi pi-times', class: 'bg-red-100 text-red-700 hover:bg-red-200' })
  } else if (status === 'reviewed') {
    actions.push({ status: 'shortlisted', label: 'Shortlist', icon: 'pi pi-star', class: 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200' })
    actions.push({ status: 'interviewed', label: 'Mark Interviewed', icon: 'pi pi-calendar', class: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' })
    actions.push({ status: 'rejected', label: 'Reject', icon: 'pi pi-times', class: 'bg-red-100 text-red-700 hover:bg-red-200' })
  } else if (status === 'shortlisted') {
    actions.push({ status: 'interviewed', label: 'Mark Interviewed', icon: 'pi pi-calendar', class: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' })
    actions.push({ status: 'rejected', label: 'Reject', icon: 'pi pi-times', class: 'bg-red-100 text-red-700 hover:bg-red-200' })
  } else if (status === 'interviewed') {
    actions.push({ status: 'offered', label: 'Make Offer', icon: 'pi pi-send', class: 'bg-orange-100 text-orange-700 hover:bg-orange-200' })
    actions.push({ status: 'rejected', label: 'Reject', icon: 'pi pi-times', class: 'bg-red-100 text-red-700 hover:bg-red-200' })
  } else if (status === 'offered') {
    actions.push({ status: 'hired', label: 'Hire', icon: 'pi pi-check', class: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' })
    actions.push({ status: 'rejected', label: 'Reject', icon: 'pi pi-times', class: 'bg-red-100 text-red-700 hover:bg-red-200' })
  }
  return actions
})

const handleStatusChange = async (status) => {
  try {
    await employerStore.updateApplicationStatus(route.params.id, status)
    Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: `Marked as ${status.replace('_', ' ')}`, showConfirmButton: false, timer: 2000 })
  } catch (err) {
    Swal.fire({ toast: true, position: 'top-end', icon: 'error', title: err.response?.data?.message || 'Failed to update status', showConfirmButton: false, timer: 3000 })
  }
}

const confirmInterview = async () => {
  try {
    await employerStore.scheduleInterview(route.params.id, interviewForm.value)
    showInterviewModal.value = false
    interviewForm.value = { scheduled_at: '', location_type: 'video_call', location_details: '', notes: '' }
    Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Interview scheduled', showConfirmButton: false, timer: 2000 })
  } catch (err) {
    Swal.fire({ toast: true, position: 'top-end', icon: 'error', title: err.response?.data?.message || 'Failed to schedule interview', showConfirmButton: false, timer: 3000 })
  }
}

const openRescheduleModal = (interview) => {
  selectedInterviewId.value = interview.id
  rescheduleForm.value = { scheduled_at: '', reschedule_reason: '' }
  showRescheduleModal.value = true
}

const confirmReschedule = async () => {
  try {
    await employerStore.rescheduleInterview(route.params.id, selectedInterviewId.value, rescheduleForm.value)
    showRescheduleModal.value = false
    Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Interview rescheduled', showConfirmButton: false, timer: 2000 })
  } catch (err) {
    Swal.fire({ toast: true, position: 'top-end', icon: 'error', title: err.response?.data?.message || 'Failed to reschedule', showConfirmButton: false, timer: 3000 })
  }
}

const cancelInterview = async (interviewId) => {
  const result = await Swal.fire({
    title: 'Cancel Interview?',
    text: 'The candidate will be notified.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#e11d48',
    cancelButtonColor: '#94a3b8',
    confirmButtonText: 'Cancel Interview',
    cancelButtonText: 'Keep',
    background: document.documentElement.classList.contains('dark') ? '#0f172a' : '#fff',
    color: document.documentElement.classList.contains('dark') ? '#fff' : '#000',
  })
  if (result.isConfirmed) {
    try {
      await employerStore.cancelInterview(route.params.id, interviewId)
      Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Interview cancelled', showConfirmButton: false, timer: 2000 })
    } catch (err) {
      Swal.fire({ toast: true, position: 'top-end', icon: 'error', title: err.response?.data?.message || 'Failed to cancel', showConfirmButton: false, timer: 3000 })
    }
  }
}

const openOutcomeModal = (interview) => {
  selectedInterviewId.value = interview.id
  outcomeForm.value = { status: 'completed', notes: '' }
  showOutcomeModal.value = true
}

const confirmOutcome = async () => {
  try {
    await employerStore.markInterviewOutcome(route.params.id, selectedInterviewId.value, outcomeForm.value.status, outcomeForm.value.notes)
    showOutcomeModal.value = false
    Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Outcome recorded', showConfirmButton: false, timer: 2000 })
  } catch (err) {
    Swal.fire({ toast: true, position: 'top-end', icon: 'error', title: err.response?.data?.message || 'Failed to record outcome', showConfirmButton: false, timer: 3000 })
  }
}

const statusClass = (status) => {
  const map = {
    applied: 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400',
    reviewed: 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400',
    shortlisted: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400',
    interviewed: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400',
    offered: 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400',
    hired: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400',
    rejected: 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400',
    withdrawn: 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400',
    job_removed: 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500',
  }
  return `px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest ${map[status] || map.applied}`
}

const interviewCardClass = (interview) => {
  if (interview.deleted_at) return 'border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30'
  if (interview.status === 'completed') return 'border-emerald-100 dark:border-emerald-900/30 bg-emerald-50/30 dark:bg-emerald-900/10'
  if (interview.status === 'no_show') return 'border-red-100 dark:border-red-900/30 bg-red-50/30 dark:bg-red-900/10'
  return 'border-indigo-100 dark:border-indigo-900/30 bg-indigo-50/30 dark:bg-indigo-900/10'
}

const interviewStatusBadge = (interview) => {
  if (interview.deleted_at) return 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-400'
  if (interview.status === 'completed') return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400'
  if (interview.status === 'no_show') return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
  return 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400'
}

const interviewStatusText = (interview) => {
  if (interview.deleted_at) {
    if (interview.cancellation_reason === 'job_removed') return 'Cancelled — Job removed'
    if (interview.cancellation_reason === 'employer_cancelled') return 'Cancelled by employer'
    if (interview.cancellation_reason === 'candidate_cancelled') return 'Cancelled by candidate'
    return 'Cancelled'
  }
  if (interview.status === 'completed') return 'Completed'
  if (interview.status === 'no_show') return 'No Show'
  return 'Scheduled'
}

const historyDotClass = (stage) => {
  const map = {
    applied: 'bg-blue-500',
    reviewed: 'bg-purple-500',
    shortlisted: 'bg-indigo-500',
    interviewed: 'bg-yellow-500',
    offered: 'bg-orange-500',
    hired: 'bg-emerald-500',
    rejected: 'bg-red-500',
    withdrawn: 'bg-slate-400',
    job_removed: 'bg-slate-300',
  }
  return map[stage] || 'bg-slate-400'
}

const formatDate = (date) =>
  date ? new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''

const formatDateTime = (date) =>
  date ? new Date(date).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : ''
</script>
