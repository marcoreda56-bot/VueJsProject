<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4">
    <div class="max-w-7xl mx-auto space-y-10">
      <!-- Header -->
      <div class="text-center mb-10">
        <h1 class="text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic mb-3">
          Browse <span class="text-indigo-600">Companies.</span>
        </h1>
        <p class="text-slate-400 font-medium max-w-2xl mx-auto">
          Discover great places to work. Explore company profiles, open positions, and employee reviews.
        </p>
      </div>

      <!-- Guest Banner -->
      <div v-if="!authStore.isAuthenticated" class="bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-900/20 rounded-[2rem] p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/20 rounded-2xl flex items-center justify-center text-indigo-600">
            <i class="pi pi-user text-xl"></i>
          </div>
          <div>
            <p class="font-bold text-slate-900 dark:text-white text-sm">Want to apply for jobs?</p>
            <p class="text-xs text-slate-500 dark:text-slate-400">Create an account or log in to start applying.</p>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <router-link to="/login" class="px-5 py-2.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-white rounded-xl text-xs font-black uppercase tracking-widest border border-slate-200 dark:border-slate-700 hover:bg-slate-50 transition-all">
            Log In
          </router-link>
          <router-link to="/register" class="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-700 transition-all">
            Sign Up
          </router-link>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div v-for="i in 6" :key="i" class="h-80 bg-white dark:bg-slate-900 rounded-[2rem] animate-pulse border border-slate-100 dark:border-slate-800"></div>
      </div>

      <!-- Empty State -->
      <div v-else-if="employers.length === 0" class="text-center py-20">
        <div class="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <i class="pi pi-building text-slate-300 text-2xl"></i>
        </div>
        <p class="text-slate-400 font-bold">No employers found.</p>
      </div>

      <!-- Employer Cards Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          v-for="emp in employers"
          :key="emp.id"
          class="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden hover:shadow-xl hover:border-indigo-200 dark:hover:border-indigo-900/30 transition-all group"
        >
          <!-- Cover Image -->
          <div class="relative h-32 bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <img
              v-if="emp.cover_image_url"
              :src="emp.cover_image_url"
              class="w-full h-full object-cover"
              alt="Company cover"
            />
            <div v-else class="w-full h-full bg-gradient-to-br from-indigo-50 to-slate-100 dark:from-indigo-900/10 dark:to-slate-800"></div>

            <!-- Logo (overlapping) -->
            <div class="absolute -bottom-8 left-8">
              <div class="w-16 h-16 bg-white dark:bg-slate-900 rounded-2xl shadow-lg border-4 border-white dark:border-slate-900 flex items-center justify-center overflow-hidden">
                <img
                  :src="emp.logo_url || '/default-logo.png'"
                  class="w-full h-full object-cover"
                  alt="Company logo"
                />
              </div>
            </div>
          </div>

          <!-- Content -->
          <div class="pt-10 pb-8 px-8">
            <!-- Header Row -->
            <div class="flex items-start justify-between gap-4 mb-3">
              <div class="min-w-0">
                <div class="flex items-center gap-2 mb-1">
                  <h3 class="font-black text-lg text-slate-900 dark:text-white truncate group-hover:text-indigo-600 transition-colors">
                    {{ emp.company_name }}
                  </h3>
                  <span v-if="emp.is_verified" class="text-emerald-500 text-sm flex-shrink-0">
                    <i class="pi pi-verified"></i>
                  </span>
                </div>
                <p class="text-xs text-slate-500 dark:text-slate-400 font-medium">{{ emp.industry }}</p>
              </div>
              <div v-if="emp.average_rating > 0" class="flex items-center gap-1 bg-amber-50 dark:bg-amber-900/10 px-2 py-1 rounded-lg flex-shrink-0">
                <i class="pi pi-star-fill text-amber-500 text-[10px]"></i>
                <span class="text-xs font-black text-amber-700 dark:text-amber-400">{{ emp.average_rating }}</span>
              </div>
            </div>

            <!-- Meta Chips -->
            <div class="flex flex-wrap gap-2 mb-4">
              <span v-if="emp.company_size" class="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-lg">
                <i class="pi pi-users mr-1"></i>{{ emp.company_size }}
              </span>
              <span v-if="emp.headquarters || emp.city" class="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-lg">
                <i class="pi pi-map-marker mr-1"></i>{{ emp.headquarters || emp.city }}
              </span>
              <span v-if="emp.founded_year" class="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-lg">
                <i class="pi pi-calendar mr-1"></i>Est. {{ emp.founded_year }}
              </span>
              <span v-if="emp.total_reviews > 0" class="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-lg">
                <i class="pi pi-comment mr-1"></i>{{ emp.total_reviews }} reviews
              </span>
            </div>

            <!-- Description -->
            <p v-if="emp.description" class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2 mb-5">
              {{ emp.description }}
            </p>

            <!-- Recent Jobs -->
            <div v-if="emp.active_jobs && emp.active_jobs.length > 0" class="mb-5">
              <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Open Positions</p>
              <div class="space-y-2">
                <div
                  v-for="job in emp.active_jobs.slice(0, 2)"
                  :key="job.id"
                  class="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl"
                >
                  <div class="min-w-0">
                    <p class="text-sm font-bold text-slate-900 dark:text-white truncate">{{ job.title }}</p>
                    <p class="text-[10px] text-slate-500 dark:text-slate-400 font-medium">{{ job.type?.replace('_', ' ') }} &bull; {{ job.location }}</p>
                  </div>
                  <div class="flex items-center gap-2 flex-shrink-0">
                    <!-- Guest: Login to apply -->
                    <template v-if="!authStore.isAuthenticated">
                      <router-link
                        :to="`/login?redirect=/jobs/${job.slug || job.id}`"
                        class="px-3 py-1.5 bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg text-[10px] font-black uppercase tracking-widest border border-slate-200 dark:border-slate-600 hover:bg-slate-100 transition-all"
                      >
                        Log in to apply
                      </router-link>
                    </template>
                    <!-- Candidate: Apply button -->
                    <template v-else-if="authStore.userRole === 'candidate'">
                      <router-link
                        :to="`/jobs/${job.slug || job.id}`"
                        class="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all"
                      >
                        Apply
                      </router-link>
                    </template>
                    <!-- Other roles: View only -->
                    <template v-else>
                      <router-link
                        :to="`/jobs/${job.slug || job.id}`"
                        class="px-3 py-1.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all"
                      >
                        View
                      </router-link>
                    </template>
                  </div>
                </div>
                <router-link
                  v-if="emp.active_jobs.length > 2"
                  :to="`/employers/${emp.slug}`"
                  class="block text-center py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-indigo-600 transition-colors"
                >
                  +{{ emp.active_jobs.length - 2 }} more open positions
                </router-link>
              </div>
            </div>

            <!-- No jobs state -->
            <div v-else class="mb-5 py-4 bg-slate-50 dark:bg-slate-800/30 rounded-xl text-center">
              <p class="text-xs text-slate-400 font-bold">No active job listings at the moment.</p>
            </div>

            <!-- Footer Actions -->
            <div class="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-slate-800">
              <router-link
                :to="`/employers/${emp.slug}`"
                class="text-xs font-black text-indigo-600 uppercase tracking-widest hover:text-indigo-700 transition-colors flex items-center gap-1"
              >
                View Profile <i class="pi pi-arrow-right text-[10px]"></i>
              </router-link>

              <button
                v-if="authStore.isAuthenticated && authStore.userRole === 'candidate'"
                @click="openReviewModal(emp)"
                class="text-xs font-black text-slate-400 uppercase tracking-widest hover:text-amber-600 transition-colors flex items-center gap-1"
              >
                <i class="pi pi-star text-[10px]"></i> Write Review
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Review Modal -->
    <div v-if="showReviewModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" @click.self="showReviewModal = false">
      <div class="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[2.5rem] p-10 border border-slate-100 dark:border-slate-800 shadow-2xl max-h-[90vh] overflow-y-auto">
        <h3 class="text-2xl font-black text-slate-900 dark:text-white mb-2">Write a Review</h3>
        <p class="text-sm text-slate-500 dark:text-slate-400 mb-6">for {{ selectedEmployer?.company_name }}</p>

        <div class="space-y-4">
          <div>
            <label class="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-2">Overall Rating</label>
            <div class="flex items-center gap-2">
              <button
                v-for="n in 5"
                :key="n"
                @click="reviewForm.rating_overall = n"
                class="text-2xl transition-colors"
                :class="n <= reviewForm.rating_overall ? 'text-amber-500' : 'text-slate-200 dark:text-slate-700'"
              >
                <i class="pi pi-star-fill"></i>
              </button>
            </div>
          </div>
          <div>
            <label class="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-2">Title</label>
            <input v-model="reviewForm.title" type="text" class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl border-none text-sm font-bold focus:ring-2 focus:ring-indigo-500" placeholder="e.g. Great place to grow" />
          </div>
          <div>
            <label class="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-2">Pros</label>
            <textarea v-model="reviewForm.pros" rows="2" class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl border-none text-sm font-bold resize-none focus:ring-2 focus:ring-indigo-500" placeholder="What's great about this company?"></textarea>
          </div>
          <div>
            <label class="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-2">Cons</label>
            <textarea v-model="reviewForm.cons" rows="2" class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl border-none text-sm font-bold resize-none focus:ring-2 focus:ring-indigo-500" placeholder="What could be improved?"></textarea>
          </div>
        </div>

        <div class="flex gap-4 pt-6">
          <button @click="showReviewModal = false" class="flex-1 py-3 text-slate-400 font-black text-xs uppercase tracking-widest hover:text-slate-900 transition-colors">Cancel</button>
          <button
            @click="submitReview"
            :disabled="!reviewForm.rating_overall || !reviewForm.title || submittingReview"
            class="flex-1 py-3 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all disabled:bg-slate-300"
          >
            {{ submittingReview ? 'Submitting...' : 'Post Review' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/AuthStore'
import { publicApi } from '@/api/services/api'
import { candidateApi } from '@/api/services/api'
import Swal from 'sweetalert2'

const authStore = useAuthStore()
const employers = ref([])
const loading = ref(false)
const showReviewModal = ref(false)
const selectedEmployer = ref(null)
const submittingReview = ref(false)

const reviewForm = ref({
  employer_id: '',
  rating_overall: 0,
  title: '',
  pros: '',
  cons: '',
  advice: '',
})

onMounted(async () => {
  loading.value = true
  try {
    const res = await publicApi.getEmployers()
    // Handle both wrapped and unwrapped responses
    const data = res.data || res
    employers.value = Array.isArray(data) ? data : data.data || []
  } catch (err) {
    console.error('Failed to load employers', err)
  } finally {
    loading.value = false
  }
})

const openReviewModal = (emp) => {
  selectedEmployer.value = emp
  reviewForm.value = {
    employer_id: emp.id,
    rating_overall: 0,
    title: '',
    pros: '',
    cons: '',
    advice: '',
  }
  showReviewModal.value = true
}

const submitReview = async () => {
  if (!reviewForm.value.rating_overall || !reviewForm.value.title) return

  submittingReview.value = true
  try {
    await candidateApi.submitReview(reviewForm.value)
    showReviewModal.value = false
    Swal.fire({
      icon: 'success',
      title: 'Review Submitted',
      text: 'Your review is pending approval.',
      timer: 2000,
      showConfirmButton: false,
    })
  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Failed to submit review',
      text: err.response?.data?.message || 'Please try again.',
      confirmButtonColor: '#6366f1',
    })
  } finally {
    submittingReview.value = false
  }
}
</script>
