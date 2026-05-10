<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4">
    <div class="max-w-5xl mx-auto">
      <div v-if="loading" class="flex justify-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
      </div>

      <div v-else-if="job" class="space-y-8">
        <!-- Header Section -->
        <div class="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-slate-200/60 dark:border-slate-800 relative overflow-hidden">
          <div class="absolute top-0 right-0 p-8 flex items-center gap-3">
            <button
              v-if="authStore.isAuthenticated && authStore.userRole === 'candidate'"
              @click="toggleSave"
              class="w-12 h-12 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center transition-all hover:scale-110"
              :class="isSaved ? 'bg-rose-50 text-rose-500 dark:bg-rose-900/20' : 'bg-white dark:bg-slate-800 text-slate-400'"
            >
              <i :class="isSaved ? 'pi pi-bookmark-fill' : 'pi pi-bookmark'"></i>
            </button>
            <span class="px-4 py-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 rounded-full text-sm font-bold uppercase tracking-wider">
              {{ job.type?.replace('_', ' ') }}
            </span>
          </div>

          <div class="flex flex-col md:flex-row gap-8 items-start md:items-center">
            <div class="w-24 h-24 bg-white dark:bg-slate-800 rounded-3xl shadow-md border dark:border-slate-700 p-4 flex items-center justify-center">
              <img
                :src="getFileUrl(job.employer?.logo) || '/default-logo.png'"
                class="max-w-full max-h-full object-contain"
                alt="Company logo"
              />
            </div>

            <div class="flex-1">
              <h1 class="text-4xl font-black text-slate-900 dark:text-white leading-tight mb-2">{{ job.title }}</h1>
              <p class="text-xl text-indigo-600 font-bold flex items-center gap-2 flex-wrap">
                <router-link
                  v-if="job.employer?.slug"
                  :to="`/employers/${job.employer.slug}`"
                  class="hover:underline"
                >
                  {{ job.employer?.company_name }}
                </router-link>
                <span v-else>{{ job.employer?.company_name }}</span>
                <span v-if="job.employer?.is_verified" class="text-emerald-500 text-sm">
                  <i class="pi pi-verified"></i>
                </span>
                <span class="text-slate-300 font-light">|</span>
                <span class="text-slate-500 dark:text-slate-400 text-lg flex items-center gap-1 font-medium">
                  <i class="pi pi-map-marker"></i> {{ job.location }}
                </span>
              </p>
            </div>

            <div class="w-full md:w-auto pt-4 md:pt-0 flex flex-col items-start md:items-end gap-2">
              <button
                v-if="applyState === 'apply'"
                @click="handleApplyClick"
                class="w-full md:w-auto px-12 py-5 bg-indigo-600 text-white rounded-2xl font-black text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 dark:shadow-none active:scale-95"
              >
                Apply Now
              </button>
              <span
                v-else-if="applyState === 'applied'"
                class="px-6 py-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded-2xl font-black text-sm uppercase tracking-widest"
              >
                <i class="pi pi-check mr-2"></i> Applied
              </span>
              <span
                v-else-if="applyState === 'no_resume'"
                class="px-6 py-3 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 rounded-2xl font-black text-xs uppercase tracking-widest text-center"
              >
                Upload a resume in your profile to apply
              </span>
              <span
                v-else-if="applyState === 'inactive'"
                class="px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-2xl font-black text-xs uppercase tracking-widest"
              >
                This job is no longer active
              </span>
            </div>
          </div>
        </div>

        <!-- Details Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Main Content (Left) -->
          <div class="lg:col-span-2 space-y-8">
            <div class="bg-white dark:bg-slate-900 rounded-[2rem] p-10 shadow-sm border border-slate-200/60 dark:border-slate-800">
              <h3 class="text-2xl font-black text-slate-900 dark:text-white mb-6 italic">About the Role</h3>
              <div class="prose prose-indigo max-w-none text-slate-600 dark:text-slate-300 leading-relaxed text-lg" v-html="job.description"></div>

              <div v-if="job.requirements" class="mt-10">
                <h4 class="text-lg font-bold text-slate-900 dark:text-white mb-4">Requirements</h4>
                <div class="prose prose-indigo max-w-none text-slate-600 dark:text-slate-300" v-html="job.requirements"></div>
              </div>

              <div v-if="job.responsibilities" class="mt-10">
                <h4 class="text-lg font-bold text-slate-900 dark:text-white mb-4">Responsibilities</h4>
                <div class="prose prose-indigo max-w-none text-slate-600 dark:text-slate-300" v-html="job.responsibilities"></div>
              </div>

              <div v-if="job.benefits" class="mt-10">
                <h4 class="text-lg font-bold text-slate-900 dark:text-white mb-4">Benefits</h4>
                <div class="prose prose-indigo max-w-none text-slate-600 dark:text-slate-300" v-html="job.benefits"></div>
              </div>

              <!-- Skills Section -->
              <div v-if="job.skills?.length" class="mt-10">
                <h4 class="text-lg font-bold text-slate-900 dark:text-white mb-4">Required Skills</h4>
                <div class="flex flex-wrap gap-2">
                  <span
                    v-for="skill in job.skills"
                    :key="skill.id"
                    class="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-medium text-sm"
                  >
                    {{ skill.name }}
                    <span v-if="skill.is_required" class="text-rose-500 text-xs font-bold ml-1">*</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Sidebar (Right) -->
          <div class="space-y-6">
            <div class="bg-white dark:bg-slate-900 rounded-[2rem] p-8 shadow-sm border border-slate-200/60 dark:border-slate-800">
              <h4 class="font-black text-slate-900 dark:text-white mb-6 uppercase text-sm tracking-widest">
                Job Summary
              </h4>
              <div class="space-y-6">
                <div class="flex items-center gap-4">
                  <div class="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl flex items-center justify-center text-emerald-600">
                    <i class="pi pi-money-bill text-xl"></i>
                  </div>
                  <div>
                    <p class="text-xs font-bold text-slate-400 uppercase">Monthly Salary</p>
                    <p class="text-lg font-black text-slate-800 dark:text-white">
                      <span v-if="job.is_salary_visible && (job.salary_min || job.salary_max)">
                        {{ job.currency || '$' }}{{ job.salary_min?.toLocaleString() }} - {{ job.currency || '$' }}{{ job.salary_max?.toLocaleString() }}
                      </span>
                      <span v-else class="text-slate-400 text-sm">Not disclosed</span>
                    </p>
                  </div>
                </div>

                <div class="flex items-center gap-4">
                  <div class="w-12 h-12 bg-blue-50 dark:bg-blue-900/10 rounded-2xl flex items-center justify-center text-blue-600">
                    <i class="pi pi-briefcase text-xl"></i>
                  </div>
                  <div>
                    <p class="text-xs font-bold text-slate-400 uppercase">Experience Level</p>
                    <p class="text-lg font-black text-slate-800 dark:text-white">
                      {{ job.experience_level || 'Not Specified' }}
                    </p>
                  </div>
                </div>

                <div class="flex items-center gap-4">
                  <div class="w-12 h-12 bg-purple-50 dark:bg-purple-900/10 rounded-2xl flex items-center justify-center text-purple-600">
                    <i class="pi pi-calendar text-xl"></i>
                  </div>
                  <div>
                    <p class="text-xs font-bold text-slate-400 uppercase">Posted Date</p>
                    <p class="text-lg font-black text-slate-800 dark:text-white">
                      {{ new Date(job.created_at).toLocaleDateString() }}
                    </p>
                  </div>
                </div>

                <div class="flex items-center gap-4">
                  <div class="w-12 h-12 bg-amber-50 dark:bg-amber-900/10 rounded-2xl flex items-center justify-center text-amber-600">
                    <i class="pi pi-users text-xl"></i>
                  </div>
                  <div>
                    <p class="text-xs font-bold text-slate-400 uppercase">Applications</p>
                    <p class="text-lg font-black text-slate-800 dark:text-white">
                      {{ job.applications_count || 0 }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Apply Modal -->
    <div
      v-if="showApplyModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
      @click.self="showApplyModal = false"
    >
      <div class="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 max-w-lg w-full shadow-2xl animate-in zoom-in duration-300 max-h-[90vh] overflow-y-auto">
        <h2 class="text-2xl font-black text-slate-900 dark:text-white mb-2">Submit Application</h2>
        <p class="text-slate-500 dark:text-slate-400 mb-8">
          Apply for <span class="font-bold text-indigo-600">{{ job.title }}</span>
        </p>

        <div v-if="resumes.length === 0" class="text-center py-8">
          <div class="w-16 h-16 bg-amber-50 dark:bg-amber-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <i class="pi pi-file text-amber-500 text-2xl"></i>
          </div>
          <h3 class="text-lg font-black text-slate-900 dark:text-white mb-2">No Resume Found</h3>
          <p class="text-sm text-slate-500 dark:text-slate-400 mb-6">
            You need to upload at least one resume before applying.
          </p>
          <router-link
            to="/candidate/profile"
            class="inline-block px-8 py-3 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all"
            @click="showApplyModal = false"
          >
            Go to Profile
          </router-link>
        </div>

        <div v-else class="space-y-6">
          <div>
            <label class="block text-sm font-black text-slate-400 uppercase mb-2">Select Your Resume</label>
            <select
              v-model="selectedResume"
              class="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 ring-indigo-500 outline-none dark:text-white"
            >
              <option value="" disabled>Choose a resume...</option>
              <option v-for="res in resumes" :key="res.id" :value="res.id">
                {{ res.title }} {{ res.is_default ? '(Default)' : '' }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-black text-slate-400 uppercase mb-2">Cover Letter (optional)</label>
            <textarea
              v-model="coverLetter"
              rows="5"
              class="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 ring-indigo-500 outline-none dark:text-white resize-none"
              placeholder="Tell the employer why you're a great fit for this role..."
            ></textarea>
          </div>

          <button
            @click="submitApplication"
            :disabled="submitting || !selectedResume"
            class="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black hover:bg-indigo-700 transition-all disabled:bg-slate-300 dark:disabled:bg-slate-700"
          >
            {{ submitting ? 'Sending...' : 'Confirm Application' }}
          </button>

          <button
            @click="showApplyModal = false"
            class="w-full text-slate-400 font-bold text-sm hover:text-slate-600 dark:hover:text-slate-300"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useJobStore } from '@/stores/JobStore'
import { useAuthStore } from '@/stores/AuthStore'
import { candidateApi, getFileUrl } from '@/api/services/api'

const route = useRoute()
const router = useRouter()
const jobStore = useJobStore()
const authStore = useAuthStore()

const job = ref(null)
const loading = ref(true)
const showApplyModal = ref(false)
const resumes = ref([])
const selectedResume = ref('')
const coverLetter = ref('')
const submitting = ref(false)
const isSaved = ref(false)

const applyState = computed(() => {
  if (!job.value) return 'inactive'
  const activeStatuses = ['active', 'pending_review']
  if (!activeStatuses.includes(job.value.status)) return 'inactive'
  if (job.value.expires_at && new Date(job.value.expires_at) < new Date()) return 'inactive'
  if (!authStore.isAuthenticated || authStore.userRole !== 'candidate') return 'apply'
  if (job.value.has_applied) return 'applied'
  return 'apply'
})

onMounted(async () => {
  const jobId = route.params.id
  loading.value = true
  try {
    const data = await jobStore.fetchJobById(jobId)
    if (data) {
      job.value = data
      if (authStore.isAuthenticated && authStore.userRole === 'candidate') {
        checkSavedStatus(jobId)
      }
    }
  } catch (error) {
    console.error('Error:', error)
  } finally {
    loading.value = false
  }
})

const checkSavedStatus = async (jobId) => {
  try {
    const saved = await candidateApi.getSavedJobs()
    isSaved.value = saved.some((s) => s.job_id === jobId || s.job?.id === jobId)
  } catch (err) {
    console.error('Failed to check saved status', err)
  }
}

const toggleSave = async () => {
  if (!authStore.isAuthenticated) {
    router.push({ name: 'login', query: { redirect: route.fullPath } })
    return
  }
  try {
    if (isSaved.value) {
      await candidateApi.unsaveJob(job.value.id)
      isSaved.value = false
    } else {
      await candidateApi.saveJob(job.value.id)
      isSaved.value = true
    }
  } catch (err) {
    alert(err.response?.data?.message || 'Failed to update saved status')
  }
}

const handleApplyClick = async () => {
  const token = localStorage.getItem('token')

  if (!token) {
    router.push({ name: 'login', query: { redirect: route.fullPath } })
    return
  }

  showApplyModal.value = true
  coverLetter.value = ''
  try {
    const resData = await candidateApi.getResumes()
    resumes.value = resData
    const defaultResume = resData.find((r) => r.is_default)
    if (defaultResume) selectedResume.value = defaultResume.id
  } catch (err) {
    console.error('Failed to load resumes', err)
  }
}

const submitApplication = async () => {
  if (!selectedResume.value) {
    alert('Please select a resume first')
    return
  }

  submitting.value = true
  try {
    await candidateApi.applyForJob({
      job_id: job.value.id,
      resume_id: selectedResume.value,
      cover_letter: coverLetter.value,
    })
    job.value.has_applied = true
    alert('Application submitted successfully!')
    showApplyModal.value = false
  } catch (err) {
    alert(err.response?.data?.message || 'Something went wrong')
  } finally {
    submitting.value = false
  }
}
</script>
