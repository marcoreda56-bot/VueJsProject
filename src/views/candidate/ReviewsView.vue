<template>
  <div class="p-6 max-w-5xl mx-auto space-y-10">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-800 dark:text-white">My Reviews</h1>
      <router-link
        to="/employers"
        class="px-6 py-3 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all"
      >
        Write a Review
      </router-link>
    </div>

    <div v-if="candidateStore.loading" class="space-y-4">
      <div v-for="i in 3" :key="i" class="h-32 bg-gray-100 dark:bg-slate-800 animate-pulse rounded-xl"></div>
    </div>

    <div
      v-else-if="candidateStore.reviews.length === 0"
      class="bg-white dark:bg-slate-900 text-center py-20 rounded-xl border dark:border-slate-800"
    >
      <div class="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
        <i class="pi pi-star text-slate-300 text-2xl"></i>
      </div>
      <p class="text-gray-500 dark:text-slate-400 font-bold">You haven't submitted any reviews yet.</p>
      <router-link to="/employers" class="text-blue-600 font-medium mt-2 inline-block">
        Browse companies to review
      </router-link>
    </div>

    <div v-else class="space-y-4">
      <div
        v-for="review in candidateStore.reviews"
        :key="review.id"
        class="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border dark:border-slate-800"
      >
        <div class="flex items-start justify-between mb-4">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-white dark:bg-slate-800 rounded-xl shadow-sm border p-2 flex items-center justify-center">
              <img
                :src="review.employer?.logo || '/default-logo.png'"
                class="max-w-full max-h-full object-contain"
                alt="Company logo"
              />
            </div>
            <div>
              <h3 class="font-bold text-slate-900 dark:text-white">{{ review.employer?.company_name }}</h3>
              <p class="text-xs text-slate-500 dark:text-slate-400">{{ review.job_title_at_time || 'Former Employee' }}</p>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <span
              class="text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest"
              :class="review.status === 'approved' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400'"
            >
              {{ review.status }}
            </span>
            <div class="flex items-center gap-1 bg-amber-50 dark:bg-amber-900/10 px-2 py-1 rounded-full">
              <i class="pi pi-star-fill text-amber-500 text-xs"></i>
              <span class="text-xs font-black text-amber-600">{{ review.rating_overall }}</span>
            </div>
          </div>
        </div>

        <h4 class="font-bold text-slate-900 dark:text-white mb-2">{{ review.title }}</h4>

        <div v-if="review.pros" class="mb-2">
          <span class="text-[10px] font-black text-emerald-600 uppercase">Pros</span>
          <p class="text-sm text-slate-600 dark:text-slate-300 mt-1">{{ review.pros }}</p>
        </div>
        <div v-if="review.cons" class="mb-2">
          <span class="text-[10px] font-black text-rose-600 uppercase">Cons</span>
          <p class="text-sm text-slate-600 dark:text-slate-300 mt-1">{{ review.cons }}</p>
        </div>
        <div v-if="review.advice" class="mb-2">
          <span class="text-[10px] font-black text-indigo-600 uppercase">Advice</span>
          <p class="text-sm text-slate-600 dark:text-slate-300 mt-1">{{ review.advice }}</p>
        </div>

        <!-- Rating Breakdown -->
        <div v-if="hasRatingBreakdown(review)" class="grid grid-cols-2 md:grid-cols-5 gap-2 mt-4">
          <div v-for="key in ratingKeys" :key="key" class="bg-slate-50 dark:bg-slate-800 rounded-xl p-3 text-center">
            <span class="text-[9px] font-black text-slate-400 uppercase block mb-1">{{ key.replace('rating_', '').replace('_', ' ') }}</span>
            <span class="text-sm font-black text-indigo-600">{{ review[key] || '-' }}</span>
          </div>
        </div>

        <div class="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-slate-50 dark:border-slate-800">
          <button
            v-if="review.status !== 'approved'"
            @click="openEditModal(review)"
            class="text-indigo-600 hover:text-indigo-700 text-sm font-bold transition"
          >
            Edit
          </button>
          <button
            v-if="review.status !== 'approved'"
            @click="deleteReviewItem(review.id)"
            class="text-rose-600 hover:text-rose-700 text-sm font-bold transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>

    <!-- Edit Review Modal -->
    <div
      v-if="editModal.open"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
      @click.self="editModal.open = false"
    >
      <div class="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto">
        <h2 class="text-2xl font-black text-slate-900 dark:text-white mb-6">Edit Review</h2>
        <div class="space-y-4">
          <div>
            <label class="block text-[10px] font-black text-slate-400 uppercase mb-2">Title</label>
            <input v-model="editForm.title" class="w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-sm dark:text-white font-bold" />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-[10px] font-black text-slate-400 uppercase mb-2">Overall Rating</label>
              <input v-model.number="editForm.rating_overall" type="number" min="1" max="5" class="w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-sm dark:text-white font-bold" />
            </div>
            <div>
              <label class="block text-[10px] font-black text-slate-400 uppercase mb-2">Job Title</label>
              <input v-model="editForm.job_title_at_time" class="w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-sm dark:text-white font-bold" />
            </div>
          </div>
          <div>
            <label class="block text-[10px] font-black text-slate-400 uppercase mb-2">Pros</label>
            <textarea v-model="editForm.pros" rows="3" class="w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-sm dark:text-white resize-none"></textarea>
          </div>
          <div>
            <label class="block text-[10px] font-black text-slate-400 uppercase mb-2">Cons</label>
            <textarea v-model="editForm.cons" rows="3" class="w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-sm dark:text-white resize-none"></textarea>
          </div>
          <div>
            <label class="block text-[10px] font-black text-slate-400 uppercase mb-2">Advice</label>
            <textarea v-model="editForm.advice" rows="3" class="w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-sm dark:text-white resize-none"></textarea>
          </div>
        </div>
        <div class="flex gap-3 mt-8">
          <button @click="editModal.open = false" class="flex-1 py-3 text-slate-400 font-bold text-xs uppercase tracking-widest hover:text-slate-900 transition-colors">
            Cancel
          </button>
          <button
            @click="saveEdit"
            :disabled="candidateStore.loading"
            class="flex-1 py-3 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all disabled:bg-slate-300"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import { useCandidateStore } from '@/stores/CandidateStore'

const candidateStore = useCandidateStore()

const ratingKeys = [
  'rating_work_life_balance',
  'rating_salary',
  'rating_culture',
  'rating_management',
  'rating_career_growth',
]

const editModal = reactive({
  open: false,
  reviewId: null,
})

const editForm = reactive({
  title: '',
  rating_overall: 5,
  job_title_at_time: '',
  pros: '',
  cons: '',
  advice: '',
})

onMounted(() => candidateStore.fetchReviews())

const hasRatingBreakdown = (review) => {
  return ratingKeys.some((k) => review[k] != null)
}

const openEditModal = (review) => {
  editModal.reviewId = review.id
  editForm.title = review.title
  editForm.rating_overall = review.rating_overall
  editForm.job_title_at_time = review.job_title_at_time || ''
  editForm.pros = review.pros || ''
  editForm.cons = review.cons || ''
  editForm.advice = review.advice || ''
  editModal.open = true
}

const saveEdit = async () => {
  try {
    await candidateStore.updateReview(editModal.reviewId, { ...editForm })
    editModal.open = false
  } catch (err) {
    alert(err.response?.data?.message || 'Failed to update review')
  }
}

const deleteReviewItem = async (id) => {
  if (confirm('Are you sure you want to delete this review?')) {
    try {
      await candidateStore.deleteReview(id)
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete review')
    }
  }
}
</script>
