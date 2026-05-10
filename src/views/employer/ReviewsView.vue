<template>
  <div class="max-w-5xl mx-auto space-y-10 animate-fadeIn">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
        Company <span class="text-indigo-600">Reviews.</span>
      </h1>
    </div>

    <div v-if="employerStore.loading" class="space-y-4">
      <div v-for="i in 3" :key="i" class="h-32 bg-gray-100 dark:bg-slate-800 animate-pulse rounded-xl"></div>
    </div>

    <div
      v-else-if="employerStore.reviews.length === 0"
      class="bg-white dark:bg-slate-900 text-center py-20 rounded-[2.5rem] border border-slate-100 dark:border-slate-800"
    >
      <div class="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
        <i class="pi pi-star text-slate-300 text-2xl"></i>
      </div>
      <p class="text-slate-500 dark:text-slate-400 font-bold">No reviews yet.</p>
    </div>

    <div v-else class="space-y-4">
      <div
        v-for="review in employerStore.reviews"
        :key="review.id"
        class="bg-white dark:bg-slate-900 p-6 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-800"
      >
        <div class="flex items-start justify-between mb-4">
          <div class="flex items-center gap-4">
            <img
              :src="review.reviewer?.avatar_url || `https://ui-avatars.com/api/?name=${review.reviewer?.first_name || 'U'}&background=6366f1&color=fff`"
              class="w-12 h-12 rounded-2xl object-cover"
            />
            <div>
              <h3 class="font-bold text-slate-900 dark:text-white">{{ review.reviewer?.first_name }} {{ review.reviewer?.last_name }}</h3>
              <p class="text-xs text-slate-500 dark:text-slate-400">{{ review.reviewer?.headline || 'Candidate' }}</p>
            </div>
          </div>
          <div class="flex items-center gap-1 bg-amber-50 dark:bg-amber-900/10 px-2 py-1 rounded-full">
            <i class="pi pi-star-fill text-amber-500 text-xs"></i>
            <span class="text-xs font-black text-amber-600">{{ review.rating_overall }}</span>
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

        <!-- Employer Reply -->
        <div v-if="review.employer_reply" class="mt-4 p-4 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-2xl border border-indigo-100 dark:border-indigo-900/20">
          <p class="text-[10px] font-black text-indigo-600 uppercase mb-1">Your Reply</p>
          <p class="text-sm text-slate-700 dark:text-slate-300">{{ review.employer_reply.message }}</p>
          <p class="text-[10px] text-slate-400 mt-1">{{ formatDate(review.employer_reply.created_at) }}</p>
        </div>
        <div v-else class="mt-4 flex items-center justify-end">
          <button
            @click="openReplyModal(review.id)"
            class="px-4 py-2 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all"
          >
            Reply
          </button>
        </div>
      </div>
    </div>

    <!-- Reply Modal -->
    <div v-if="replyModal.open" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" @click.self="replyModal.open = false">
      <div class="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[2.5rem] p-10 border border-slate-100 dark:border-slate-800 shadow-2xl">
        <h3 class="text-2xl font-black text-slate-900 dark:text-white mb-6">Reply to Review</h3>
        <textarea
          v-model="replyForm.message"
          rows="5"
          placeholder="Write your response..."
          class="w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-sm dark:text-white font-bold resize-none focus:ring-2 focus:ring-indigo-500 outline-none"
        ></textarea>
        <div class="flex gap-4 pt-6">
          <button @click="replyModal.open = false" class="flex-1 py-4 font-black uppercase text-xs tracking-widest text-slate-400 hover:text-slate-600 transition-colors">Cancel</button>
          <button
            @click="submitReply"
            :disabled="employerStore.loading || !replyForm.message.trim()"
            class="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-indigo-700 transition-all disabled:bg-slate-300"
          >
            {{ employerStore.loading ? 'Saving...' : 'Post Reply' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import { useEmployerStore } from '@/stores/EmployerStore'

const employerStore = useEmployerStore()

const replyModal = reactive({
  open: false,
  reviewId: null,
})

const replyForm = reactive({
  message: '',
})

onMounted(() => employerStore.fetchReviews())

const openReplyModal = (reviewId) => {
  replyModal.reviewId = reviewId
  replyForm.message = ''
  replyModal.open = true
}

const submitReply = async () => {
  try {
    await employerStore.replyToReview(replyModal.reviewId, replyForm.message)
    replyModal.open = false
  } catch (err) {
    alert(err.response?.data?.message || 'Failed to post reply')
  }
}

const formatDate = (date) =>
  date ? new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''
</script>
