<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4">
    <div class="max-w-5xl mx-auto space-y-10">
      <div v-if="loading" class="flex justify-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
      </div>

      <div v-else-if="employer" class="space-y-10">
        <!-- Header -->
        <div class="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-slate-100 dark:border-slate-800 relative overflow-hidden">
          <div class="flex flex-col md:flex-row gap-8 items-start md:items-center">
            <div class="w-24 h-24 bg-white dark:bg-slate-800 rounded-3xl shadow-md border dark:border-slate-700 p-4 flex items-center justify-center">
              <img
                :src="getFileUrl(employer.logo) || '/default-logo.png'"
                class="max-w-full max-h-full object-contain"
                alt="Company logo"
              />
            </div>
            <div class="flex-1">
              <div class="flex items-center gap-3 mb-2">
                <h1 class="text-4xl font-black text-slate-900 dark:text-white leading-tight">{{ employer.company_name }}</h1>
                <span v-if="employer.is_verified" class="text-emerald-500 text-xl">
                  <i class="pi pi-verified"></i>
                </span>
              </div>
              <p class="text-lg text-indigo-600 font-bold">{{ employer.industry }}</p>
              <p class="text-sm text-slate-500 dark:text-slate-400 mt-2 flex items-center gap-4 flex-wrap">
                <span v-if="employer.headquarters" class="flex items-center gap-1">
                  <i class="pi pi-map-marker"></i> {{ employer.headquarters }}
                </span>
                <span v-if="employer.founded_year" class="flex items-center gap-1">
                  <i class="pi pi-calendar"></i> Founded {{ employer.founded_year }}
                </span>
                <span v-if="employer.company_size" class="flex items-center gap-1">
                  <i class="pi pi-users"></i> {{ employer.company_size }}
                </span>
              </p>
            </div>
            <div v-if="employer.rating" class="flex flex-col items-center bg-amber-50 dark:bg-amber-900/10 rounded-2xl p-4 border border-amber-100 dark:border-amber-900/20">
              <span class="text-3xl font-black text-amber-600">{{ employer.rating }}</span>
              <span class="text-[10px] font-black text-amber-600 uppercase tracking-widest">Rating</span>
            </div>
          </div>
          <p v-if="employer.description" class="mt-6 text-slate-600 dark:text-slate-300 leading-relaxed">
            {{ employer.description }}
          </p>
          <div class="flex items-center gap-4 mt-6">
            <a
              v-if="employer.website"
              :href="employer.website"
              target="_blank"
              class="inline-flex items-center gap-2 text-indigo-600 font-bold text-sm hover:underline"
            >
              <i class="pi pi-globe"></i> Visit Website
            </a>
            <button
              v-if="authStore.isAuthenticated && authStore.userRole === 'candidate'"
              @click="showReviewModal = true"
              class="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all"
            >
              <i class="pi pi-pencil"></i> Write a Review
            </button>
          </div>
        </div>

        <!-- Active Jobs -->
        <div class="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-slate-100 dark:border-slate-800">
          <h2 class="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-8">
            Open Positions
          </h2>
          <div v-if="jobs.length === 0" class="text-center py-12">
            <p class="text-slate-400 font-bold">No active job listings at the moment.</p>
          </div>
          <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <router-link
              v-for="job in jobs"
              :key="job.id"
              :to="`/jobs/${job.slug || job.id}`"
              class="p-6 border border-slate-50 dark:border-slate-800 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all group"
            >
              <h3 class="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                {{ job.title }}
              </h3>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-2 flex items-center gap-3">
                <span>{{ job.type?.replace('_', ' ') }}</span>
                <span class="w-1 h-1 bg-slate-300 rounded-full"></span>
                <span>{{ job.location }}</span>
              </p>
            </router-link>
          </div>
        </div>

        <!-- Reviews -->
        <div class="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-slate-100 dark:border-slate-800">
          <h2 class="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-8">
            Reviews
          </h2>
          <div v-if="reviews.length === 0" class="text-center py-12">
            <p class="text-slate-400 font-bold">No reviews yet.</p>
          </div>
          <div v-else class="space-y-6">
            <div
              v-for="review in reviews"
              :key="review.id"
              class="p-6 border border-slate-50 dark:border-slate-800 rounded-2xl"
            >
              <div class="flex items-start justify-between mb-4">
                <div>
                  <h4 class="font-bold text-slate-900 dark:text-white">{{ review.title }}</h4>
                  <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    <span v-if="!review.is_anonymous" class="font-bold">{{ review.candidate_name }}</span>
                    <span v-else class="italic">Anonymous</span>
                    <span class="mx-2">&bull;</span>
                    <span>{{ review.job_title_at_time || 'Former Employee' }}</span>
                  </p>
                </div>
                <div class="flex items-center gap-1 bg-amber-50 dark:bg-amber-900/10 px-3 py-1 rounded-full">
                  <i class="pi pi-star-fill text-amber-500 text-xs"></i>
                  <span class="text-xs font-black text-amber-600">{{ review.rating_overall }}</span>
                </div>
              </div>
              <div v-if="review.pros" class="mb-2">
                <span class="text-[10px] font-black text-emerald-600 uppercase">Pros</span>
                <p class="text-sm text-slate-600 dark:text-slate-300 mt-1">{{ review.pros }}</p>
              </div>
              <div v-if="review.cons" class="mb-2">
                <span class="text-[10px] font-black text-rose-600 uppercase">Cons</span>
                <p class="text-sm text-slate-600 dark:text-slate-300 mt-1">{{ review.cons }}</p>
              </div>
              <p class="text-xs text-slate-400 mt-3">{{ formatDate(review.created_at) }}</p>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-20">
        <p class="text-slate-400 font-bold">Employer not found.</p>
      </div>
    </div>

    <!-- Review Modal -->
    <div
      v-if="showReviewModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
      @click.self="showReviewModal = false"
    >
      <div class="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 max-w-xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
        <h2 class="text-2xl font-black text-slate-900 dark:text-white mb-2">Write a Review</h2>
        <p class="text-slate-500 dark:text-slate-400 mb-6 text-sm">
          for <span class="font-bold text-indigo-600">{{ employer?.company_name }}</span>
        </p>

        <div class="space-y-4">
          <div>
            <label class="block text-[10px] font-black text-slate-400 uppercase mb-2">Review Title *</label>
            <input
              v-model="reviewForm.title"
              class="w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-sm dark:text-white font-bold"
              placeholder="e.g. Great place to grow your career"
            />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-[10px] font-black text-slate-400 uppercase mb-2">Overall Rating *</label>
              <select v-model.number="reviewForm.rating_overall" class="w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-sm dark:text-white font-bold">
                <option v-for="n in 5" :key="n" :value="n">{{ n }} — {{ n === 1 ? 'Poor' : n === 2 ? 'Fair' : n === 3 ? 'Good' : n === 4 ? 'Very Good' : 'Excellent' }}</option>
              </select>
            </div>
            <div>
              <label class="block text-[10px] font-black text-slate-400 uppercase mb-2">Job Title at Company</label>
              <input
                v-model="reviewForm.job_title_at_time"
                class="w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-sm dark:text-white font-bold"
                placeholder="e.g. Software Engineer"
              />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-[10px] font-black text-slate-400 uppercase mb-2">Employment Type</label>
              <select v-model="reviewForm.employment_type" class="w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-sm dark:text-white font-bold">
                <option value="full_time">Full Time</option>
                <option value="part_time">Part Time</option>
                <option value="contract">Contract</option>
                <option value="freelance">Freelance</option>
                <option value="internship">Internship</option>
              </select>
            </div>
            <div class="flex items-center gap-4">
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" v-model="reviewForm.is_current_employee" class="accent-indigo-600 w-5 h-5" />
                <span class="text-xs font-bold text-slate-500">Current Employee</span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" v-model="reviewForm.is_anonymous" class="accent-indigo-600 w-5 h-5" />
                <span class="text-xs font-bold text-slate-500">Anonymous</span>
              </label>
            </div>
          </div>

          <!-- Optional Ratings -->
          <div class="grid grid-cols-2 md:grid-cols-5 gap-2">
            <div v-for="key in ['rating_work_life_balance', 'rating_salary', 'rating_culture', 'rating_management', 'rating_career_growth']" :key="key">
              <label class="block text-[9px] font-black text-slate-400 uppercase mb-1">{{ key.replace('rating_', '').replace('_', ' ') }}</label>
              <select v-model.number="reviewForm[key]" class="w-full p-2 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-xs dark:text-white font-bold">
                <option :value="null">—</option>
                <option v-for="n in 5" :key="n" :value="n">{{ n }}</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-[10px] font-black text-slate-400 uppercase mb-2">Pros</label>
            <textarea v-model="reviewForm.pros" rows="3" class="w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-sm dark:text-white resize-none" placeholder="What do you like about this company?"></textarea>
          </div>
          <div>
            <label class="block text-[10px] font-black text-slate-400 uppercase mb-2">Cons</label>
            <textarea v-model="reviewForm.cons" rows="3" class="w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-sm dark:text-white resize-none" placeholder="What could be improved?"></textarea>
          </div>
          <div>
            <label class="block text-[10px] font-black text-slate-400 uppercase mb-2">Advice to Management</label>
            <textarea v-model="reviewForm.advice" rows="3" class="w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-sm dark:text-white resize-none" placeholder="Any advice for the leadership team?"></textarea>
          </div>
        </div>

        <div class="flex gap-3 mt-8">
          <button @click="showReviewModal = false" class="flex-1 py-3 text-slate-400 font-bold text-xs uppercase tracking-widest hover:text-slate-900 transition-colors">
            Cancel
          </button>
          <button
            @click="submitReview"
            :disabled="submittingReview"
            class="flex-1 py-3 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all disabled:bg-slate-300"
          >
            {{ submittingReview ? 'Submitting...' : 'Submit Review' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/AuthStore'
import { publicApi, candidateApi, getFileUrl } from '@/api/services/api'

const route = useRoute()
const authStore = useAuthStore()
const employer = ref(null)
const jobs = ref([])
const reviews = ref([])
const loading = ref(false)
const showReviewModal = ref(false)
const submittingReview = ref(false)

const reviewForm = reactive({
  employer_id: '',
  job_title_at_time: '',
  employment_type: 'full_time',
  is_current_employee: false,
  is_anonymous: false,
  rating_overall: 5,
  rating_work_life_balance: null,
  rating_salary: null,
  rating_culture: null,
  rating_management: null,
  rating_career_growth: null,
  title: '',
  pros: '',
  cons: '',
  advice: '',
})

const resetReviewForm = () => {
  Object.assign(reviewForm, {
    employer_id: employer.value?.id || '',
    job_title_at_time: '',
    employment_type: 'full_time',
    is_current_employee: false,
    is_anonymous: false,
    rating_overall: 5,
    rating_work_life_balance: null,
    rating_salary: null,
    rating_culture: null,
    rating_management: null,
    rating_career_growth: null,
    title: '',
    pros: '',
    cons: '',
    advice: '',
  })
}

onMounted(async () => {
  loading.value = true
  try {
    const slug = route.params.slug
    const data = await publicApi.getEmployerBySlug(slug)
    employer.value = data
    jobs.value = data.recent_jobs || []
    reviews.value = data.recent_reviews || []
    resetReviewForm()
  } catch (err) {
    console.error('Failed to load employer', err)
  } finally {
    loading.value = false
  }
})

const submitReview = async () => {
  if (!reviewForm.title || !reviewForm.rating_overall) {
    alert('Please provide a title and overall rating')
    return
  }
  submittingReview.value = true
  try {
    await candidateApi.submitReview(reviewForm)
    showReviewModal.value = false
    resetReviewForm()
    // Refresh employer data to show new review
    const data = await publicApi.getEmployerBySlug(route.params.slug)
    employer.value = data
    reviews.value = data.recent_reviews || []
    alert('Review submitted successfully! It will be visible after admin approval.')
  } catch (err) {
    alert(err.response?.data?.message || 'Failed to submit review')
  } finally {
    submittingReview.value = false
  }
}

const formatDate = (date) =>
  date ? new Date(date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : ''
</script>
