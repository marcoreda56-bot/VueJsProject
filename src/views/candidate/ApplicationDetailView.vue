<template>
  <div class="p-6 max-w-5xl mx-auto space-y-8">
    <button
      @click="$router.back()"
      class="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors"
    >
      <i class="pi pi-arrow-left"></i> Back to Applications
    </button>

    <div v-if="candidateStore.loading" class="flex justify-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
    </div>

    <div v-else-if="application" class="space-y-8">
      <!-- Job Removed Banner -->
      <div
        v-if="application.job_removed_at"
        class="bg-slate-100 dark:bg-slate-800 border-l-4 border-slate-400 p-6 rounded-r-2xl"
      >
        <p class="text-sm font-bold text-slate-600 dark:text-slate-300">
          <i class="pi pi-exclamation-circle mr-2"></i>
          This job was removed by the employer on {{ formatDate(application.job_removed_at) }}. Your application record is preserved.
        </p>
      </div>

      <!-- Header Card -->
      <div class="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-slate-100 dark:border-slate-800">
        <div class="flex flex-col md:flex-row justify-between items-start gap-6">
          <div class="flex items-center gap-6">
            <div class="w-20 h-20 bg-white dark:bg-slate-800 rounded-3xl shadow-md border p-4 flex items-center justify-center">
              <img
                :src="application.employer_snapshot?.logo_url || '/default-logo.png'"
                class="max-w-full max-h-full object-contain"
                alt="Company logo"
              />
            </div>
            <div>
              <h1 class="text-2xl font-black text-slate-900 dark:text-white">
                {{ application.job_snapshot?.title }}
              </h1>
              <p class="text-lg text-indigo-600 font-bold">
                {{ application.employer_snapshot?.company_name }}
                <span v-if="application.employer_snapshot?.is_verified" class="text-emerald-500 text-sm ml-2">
                  <i class="pi pi-verified"></i> Verified
                </span>
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

        <!-- Withdraw Button -->
        <div v-if="canWithdraw" class="mt-8 pt-6 border-t border-slate-50 dark:border-slate-800">
          <button
            @click="showWithdrawModal = true"
            class="text-rose-600 font-bold text-sm hover:text-rose-700 transition flex items-center gap-2"
          >
            <i class="pi pi-times-circle"></i> Withdraw Application
          </button>
        </div>
      </div>

      <!-- Job Snapshot Accordion -->
      <div
        class="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden"
      >
        <button
          @click="showJobSnapshot = !showJobSnapshot"
          class="w-full p-8 md:p-10 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all"
        >
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl flex items-center justify-center text-indigo-600">
              <i class="pi pi-briefcase text-sm"></i>
            </div>
            <div class="text-left">
              <h3 class="font-black text-slate-900 dark:text-white text-sm uppercase tracking-widest">
                Job Details at Time of Application
              </h3>
              <p class="text-xs text-slate-400 font-medium mt-0.5">
                {{ application.job_snapshot?.title }} @ {{ application.employer_snapshot?.company_name }}
              </p>
            </div>
          </div>
          <div
            class="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center transition-transform duration-300"
            :class="showJobSnapshot ? 'rotate-180' : ''"
          >
            <i class="pi pi-chevron-down text-xs text-slate-400"></i>
          </div>
        </button>

        <div
          v-if="showJobSnapshot"
          class="px-8 md:px-10 pb-8 md:pb-10 border-t border-slate-50 dark:border-slate-800"
        >
          <div class="pt-6 space-y-6">
            <!-- Meta Chips -->
            <div class="flex flex-wrap gap-2">
              <span
                v-if="application.job_snapshot?.type"
                :class="jobTypeClass(application.job_snapshot.type)"
                class="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl border"
              >
                <i class="pi pi-clock mr-1"></i>{{ application.job_snapshot.type.replace('_', ' ') }}
              </span>
              <span
                v-if="application.job_snapshot?.workplace_type"
                :class="workplaceClass(application.job_snapshot.workplace_type)"
                class="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl border"
              >
                <i class="pi pi-globe mr-1"></i>{{ application.job_snapshot.workplace_type.replace('_', ' ') }}
              </span>
              <span
                v-if="application.job_snapshot?.experience_level"
                :class="experienceClass(application.job_snapshot.experience_level)"
                class="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl border"
              >
                {{ application.job_snapshot.experience_level }}
              </span>
              <span
                v-if="application.job_snapshot?.salary_min || application.job_snapshot?.salary_max"
                class="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl border bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/10 dark:text-emerald-400 dark:border-emerald-900/20"
              >
                <i class="pi pi-money-bill mr-1"></i>{{ formatSnapshotSalary(application.job_snapshot) }}
              </span>
              <span
                v-if="application.job_snapshot?.location"
                class="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl border bg-slate-50 text-slate-600 border-slate-100 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700"
              >
                <i class="pi pi-map-marker mr-1"></i>{{ application.job_snapshot.location }}
              </span>
            </div>

            <!-- Description -->
            <section v-if="application.job_snapshot?.description">
              <h4 class="text-sm font-black text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                <span class="w-6 h-6 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg flex items-center justify-center text-indigo-600">
                  <i class="pi pi-file-edit text-[10px]"></i>
                </span>
                Description
              </h4>
              <div
                class="prose prose-slate max-w-none text-sm text-slate-600 dark:text-slate-300 leading-relaxed"
                v-html="application.job_snapshot.description"
              ></div>
            </section>

            <!-- Requirements -->
            <section v-if="application.job_snapshot?.requirements">
              <h4 class="text-sm font-black text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                <span class="w-6 h-6 bg-rose-50 dark:bg-rose-900/20 rounded-lg flex items-center justify-center text-rose-600">
                  <i class="pi pi-list-check text-[10px]"></i>
                </span>
                Requirements
              </h4>
              <div
                class="prose prose-slate max-w-none text-sm text-slate-600 dark:text-slate-300 leading-relaxed"
                v-html="application.job_snapshot.requirements"
              ></div>
            </section>

            <!-- Benefits -->
            <section v-if="application.job_snapshot?.benefits">
              <h4 class="text-sm font-black text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                <span class="w-6 h-6 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg flex items-center justify-center text-emerald-600">
                  <i class="pi pi-gift text-[10px]"></i>
                </span>
                Benefits
              </h4>
              <div
                class="prose prose-slate max-w-none text-sm text-slate-600 dark:text-slate-300 leading-relaxed"
                v-html="application.job_snapshot.benefits"
              ></div>
            </section>

            <!-- Skills -->
            <section v-if="application.job_snapshot?.skills?.length">
              <h4 class="text-sm font-black text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                <span class="w-6 h-6 bg-purple-50 dark:bg-purple-900/20 rounded-lg flex items-center justify-center text-purple-600">
                  <i class="pi pi-star text-[10px]"></i>
                </span>
                Required Skills
              </h4>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="skill in application.job_snapshot.skills"
                  :key="skill.name"
                  class="px-4 py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold text-sm border border-slate-100 dark:border-slate-700 flex items-center gap-2"
                >
                  {{ skill.name }}
                  <span
                    v-if="skill.is_required"
                    class="text-[10px] font-black text-rose-500 bg-rose-50 dark:bg-rose-900/20 px-1.5 py-0.5 rounded-md"
                  >Required</span>
                </span>
              </div>
            </section>

            <!-- Employer Info (at time of application) -->
            <section
              v-if="application.employer_snapshot?.industry || application.employer_snapshot?.headquarters || application.employer_snapshot?.website"
            >
              <h4 class="text-sm font-black text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                <span class="w-6 h-6 bg-amber-50 dark:bg-amber-900/20 rounded-lg flex items-center justify-center text-amber-600">
                  <i class="pi pi-building text-[10px]"></i>
                </span>
                Employer (at time of application)
              </h4>
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div v-if="application.employer_snapshot?.industry" class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600">
                    <i class="pi pi-briefcase text-[10px]"></i>
                  </div>
                  <div>
                    <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Industry</p>
                    <p class="text-sm font-bold text-slate-900 dark:text-white">{{ application.employer_snapshot.industry }}</p>
                  </div>
                </div>
                <div v-if="application.employer_snapshot?.headquarters" class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600">
                    <i class="pi pi-map-marker text-[10px]"></i>
                  </div>
                  <div>
                    <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Headquarters</p>
                    <p class="text-sm font-bold text-slate-900 dark:text-white">{{ application.employer_snapshot.headquarters }}</p>
                  </div>
                </div>
                <div v-if="application.employer_snapshot?.website" class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-lg bg-sky-50 dark:bg-sky-900/20 flex items-center justify-center text-sky-600">
                    <i class="pi pi-globe text-[10px]"></i>
                  </div>
                  <div>
                    <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Website</p>
                    <a
                      :href="application.employer_snapshot.website"
                      target="_blank"
                      class="text-sm font-bold text-indigo-600 hover:underline"
                    >
                      {{ application.employer_snapshot.website }}
                    </a>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      <!-- Cover Letter -->
      <div
        v-if="application.cover_letter"
        class="bg-white dark:bg-slate-900 rounded-[2rem] p-8 shadow-sm border border-slate-100 dark:border-slate-800"
      >
        <h3 class="font-black text-slate-900 dark:text-white uppercase tracking-widest text-xs mb-4">
          Your Cover Letter
        </h3>
        <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
          {{ application.cover_letter }}
        </p>
      </div>

      <!-- Resume -->
      <div
        v-if="application.resume_url"
        class="bg-white dark:bg-slate-900 rounded-[2rem] p-8 shadow-sm border border-slate-100 dark:border-slate-800"
      >
        <h3 class="font-black text-slate-900 dark:text-white uppercase tracking-widest text-xs mb-4">
          Submitted Resume
        </h3>
        <a
          @click="viewResume"
          class="inline-flex items-center gap-3 px-6 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 transition-all cursor-pointer"
        >
          <i class="pi pi-file-pdf text-rose-500 text-xl"></i>
          {{ downloadingResume ? 'Opening...' : 'View Resume' }}
        </a>
      </div>

      <!-- Interviews -->
      <div
        v-if="application.interviews && application.interviews.length > 0"
        class="bg-white dark:bg-slate-900 rounded-[2rem] p-8 shadow-sm border border-slate-100 dark:border-slate-800"
      >
        <h3 class="font-black text-slate-900 dark:text-white uppercase tracking-widest text-xs mb-6">
          Interviews
        </h3>
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
                  <span
                    class="text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest"
                    :class="interviewStatusBadge(interview)"
                  >
                    {{ interviewStatusText(interview) }}
                  </span>
                  <span class="text-xs text-slate-400 font-bold">
                    {{ interview.location_type?.replace('_', ' ') }}
                  </span>
                </div>
                <p class="text-sm font-bold text-slate-800 dark:text-white">
                  <i class="pi pi-calendar mr-2 text-indigo-500"></i>
                  {{ formatDateTime(interview.scheduled_at) }}
                </p>
                <p v-if="interview.location_details" class="text-xs text-slate-500 mt-1">
                  <i class="pi pi-map-marker mr-1"></i> {{ interview.location_details }}
                </p>
                <p v-if="interview.notes" class="text-xs text-slate-500 mt-2 italic">
                  "{{ interview.notes }}"
                </p>
              </div>
              <a
                v-if="interview.location_type === 'video_call' && interview.location_details && !interview.deleted_at && interview.status === 'scheduled'"
                :href="interview.location_details"
                target="_blank"
                class="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-700 transition"
              >
                Join Call
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- History Timeline -->
      <div class="bg-white dark:bg-slate-900 rounded-[2rem] p-8 shadow-sm border border-slate-100 dark:border-slate-800">
        <h3 class="font-black text-slate-900 dark:text-white uppercase tracking-widest text-xs mb-6">
          Application Timeline
        </h3>
        <div class="space-y-6">
          <div
            v-for="(entry, index) in application.history"
            :key="entry.id"
            class="relative pl-8"
            :class="{ 'opacity-50': entry.stage === 'withdrawn' || entry.stage === 'rejected' }"
          >
            <div
              class="absolute left-0 top-1 w-2 h-2 rounded-full"
              :class="historyDotClass(entry.stage)"
            ></div>
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
                <p v-if="entry.notes" class="text-xs text-slate-400 mt-1 italic">
                  "{{ entry.notes }}"
                </p>
              </div>
              <span class="text-xs text-slate-400 font-bold whitespace-nowrap">
                {{ formatDateTime(entry.created_at) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-20">
      <p class="text-slate-400 font-bold">Application not found.</p>
    </div>

    <!-- Withdraw Modal -->
    <div
      v-if="showWithdrawModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
      @click.self="showWithdrawModal = false"
    >
      <div class="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 max-w-md w-full shadow-2xl">
        <h2 class="text-2xl font-black text-slate-900 dark:text-white mb-2">Withdraw Application</h2>
        <p class="text-slate-500 dark:text-slate-400 mb-6 text-sm">
          Are you sure? This cannot be undone.
        </p>

        <div class="mb-6">
          <label class="block text-sm font-black text-slate-400 uppercase mb-2">Reason (optional)</label>
          <textarea
            v-model="withdrawReason"
            rows="3"
            class="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 ring-indigo-500 outline-none text-sm dark:text-white"
            placeholder="Tell us why you're withdrawing..."
          ></textarea>
        </div>

        <div class="flex gap-3">
          <button
            @click="showWithdrawModal = false"
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
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useCandidateStore } from '@/stores/CandidateStore'
import { downloadResumeBlob } from '@/api/services/api'

const route = useRoute()
const candidateStore = useCandidateStore()

const application = computed(() => candidateStore.currentApplication)
const showWithdrawModal = ref(false)
const withdrawReason = ref('')
const downloadingResume = ref(false)
const showJobSnapshot = ref(false)

const canWithdraw = computed(() => {
  if (!application.value) return false
  const status = application.value.current_status
  const allowed = ['applied', 'reviewed', 'shortlisted', 'interviewed', 'offered']
  return allowed.includes(status)
})

onMounted(async () => {
  try {
    await candidateStore.fetchApplication(route.params.id)
  } catch (err) {
    console.error('Failed to load application', err)
  }
})

const confirmWithdraw = async () => {
  try {
    await candidateStore.withdrawApplication(route.params.id, withdrawReason.value)
    showWithdrawModal.value = false
    await candidateStore.fetchApplication(route.params.id)
  } catch (err) {
    alert(err.response?.data?.message || 'Failed to withdraw application')
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
    if (interview.cancellation_reason === 'candidate_cancelled') return 'Cancelled — You withdrew'
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

const viewResume = async () => {
  if (!application.value?.id) return
  downloadingResume.value = true
  try {
    const blobUrl = await downloadResumeBlob(application.value.id)
    window.open(blobUrl, '_blank')
  } catch (err) {
    console.error('Failed to open resume', err)
    alert('Failed to open resume. Please try again.')
  } finally {
    downloadingResume.value = false
  }
}

const formatSnapshotSalary = (snapshot) => {
  const min = snapshot.salary_min
  const max = snapshot.salary_max
  const currency = snapshot.currency || 'EGP'
  if (!min && !max) return 'Not disclosed'
  if (!max) return `${Number(min).toLocaleString()} ${currency}+`
  if (!min) return `Up to ${Number(max).toLocaleString()} ${currency}`
  return `${Number(min).toLocaleString()} - ${Number(max).toLocaleString()} ${currency}`
}

const jobTypeClass = (type) => {
  const map = {
    full_time: 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/10 dark:text-emerald-400 dark:border-emerald-900/20',
    part_time: 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-900/10 dark:text-amber-400 dark:border-amber-900/20',
    contract: 'bg-purple-50 text-purple-700 border-purple-100 dark:bg-purple-900/10 dark:text-purple-400 dark:border-purple-900/20',
    freelance: 'bg-indigo-50 text-indigo-700 border-indigo-100 dark:bg-indigo-900/10 dark:text-indigo-400 dark:border-indigo-900/20',
    internship: 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/10 dark:text-blue-400 dark:border-blue-900/20',
  }
  return map[type] || 'bg-slate-50 text-slate-600 border-slate-100 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
}

const workplaceClass = (type) => {
  const map = {
    remote: 'bg-sky-50 text-sky-700 border-sky-100 dark:bg-sky-900/10 dark:text-sky-400 dark:border-sky-900/20',
    on_site: 'bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-900/10 dark:text-rose-400 dark:border-rose-900/20',
    hybrid: 'bg-violet-50 text-violet-700 border-violet-100 dark:bg-violet-900/10 dark:text-violet-400 dark:border-violet-900/20',
  }
  return map[type] || 'bg-slate-50 text-slate-600 border-slate-100 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
}

const experienceClass = (level) => {
  const map = {
    junior: 'bg-teal-50 text-teal-700 border-teal-100 dark:bg-teal-900/10 dark:text-teal-400 dark:border-teal-900/20',
    mid: 'bg-orange-50 text-orange-700 border-orange-100 dark:bg-orange-900/10 dark:text-orange-400 dark:border-orange-900/20',
    senior: 'bg-red-50 text-red-700 border-red-100 dark:bg-red-900/10 dark:text-red-400 dark:border-red-900/20',
    lead: 'bg-pink-50 text-pink-700 border-pink-100 dark:bg-pink-900/10 dark:text-pink-400 dark:border-pink-900/20',
    executive: 'bg-yellow-50 text-yellow-700 border-yellow-100 dark:bg-yellow-900/10 dark:text-yellow-400 dark:border-yellow-900/20',
  }
  return map[level] || 'bg-slate-50 text-slate-600 border-slate-100 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
}

const formatDate = (date) =>
  date ? new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''

const formatDateTime = (date) =>
  date
    ? new Date(date).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : ''
</script>
