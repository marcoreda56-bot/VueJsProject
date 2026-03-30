<template>
  <div
    v-if="auth.user"
    class="min-h-screen py-20 px-6 font-['Outfit'] bg-[#FAFAFA] dark:bg-slate-950"
  >
    <div class="max-w-2xl mx-auto">
      <header class="text-center mb-12 animate-[fadeIn_0.5s_ease-out]">
        <h1 class="text-4xl font-black text-slate-900 dark:text-white tracking-tighter italic mb-2">
          Easy <span class="text-indigo-600">Apply</span>
        </h1>
        <p class="text-slate-400 font-bold text-[10px] uppercase tracking-widest italic">
          Your profile data will be shared with the employer
        </p>
      </header>

      <form
        @submit.prevent="handleApply"
        class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-12 rounded-[3.5rem] shadow-xl space-y-8 relative overflow-hidden"
      >
        <div class="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl rounded-full"></div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-2">
            <label
              class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 italic"
              >Full Name</label
            >
            <div
              class="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl text-slate-500 font-bold border border-slate-100 dark:border-slate-800/50"
            >
              {{ auth.user.name }}
            </div>
          </div>
          <div class="space-y-2">
            <label
              class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 italic"
              >Professional Title</label
            >
            <div
              class="px-6 py-4 bg-indigo-50/50 dark:bg-indigo-500/5 rounded-2xl text-indigo-600 font-black text-xs uppercase tracking-tight"
            >
              {{ candidateStore.profile?.title || 'Completing Profile...' }}
            </div>
          </div>
        </div>

        <div class="space-y-2">
          <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 italic"
            >Cover Letter</label
          >
          <textarea
            v-model="coverLetter"
            rows="6"
            placeholder="Tell them why you're the perfect fit for HireMasr..."
            class="w-full px-8 py-6 bg-slate-50 dark:bg-slate-800 border-none rounded-[2.5rem] outline-none font-medium text-slate-600 dark:text-slate-300 focus:ring-4 ring-indigo-500/10 transition-all resize-none"
          ></textarea>
        </div>

        <button
          :disabled="loading || !candidateStore.profile"
          class="w-full py-6 bg-slate-900 dark:bg-indigo-600 text-white rounded-[2rem] font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl hover:shadow-indigo-500/40 transition-all flex items-center justify-center gap-4 group"
        >
          <i v-if="loading" class="pi pi-spin pi-spinner text-xs"></i>
          <span v-else class="flex items-center gap-3">
            Confirm
            <i
              class="pi pi-arrow-right text-[8px] group-hover:translate-x-1 transition-transform"
            ></i>
          </span>
        </button>
      </form>
    </div>
  </div>

  <div v-else class="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950">
    <div
      class="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"
    ></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { useCandidateStore } from '@/stores/candidate.store'
import Swal from 'sweetalert2'

const auth = useAuthStore()
const candidateStore = useCandidateStore()
const route = useRoute()
const router = useRouter()

const coverLetter = ref('')
const loading = ref(false)

onMounted(async () => {
  await candidateStore.initialize()
})

const handleApply = async () => {
  if (!coverLetter.value.trim()) {
    return Swal.fire({
      title: 'Missing Info',
      text: 'Please add a cover letter to stand out.',
      icon: 'warning',
      confirmButtonColor: '#6366f1',
    })
  }

  loading.value = true
  try {
    await candidateStore.applyForJob(route.params.id, coverLetter.value)

    await Swal.fire({
      title: 'Track Added!',
      text: 'Your application is now live on SouqMasr network.',
      icon: 'success',
      confirmButtonColor: '#6366f1',
    })

    router.push({ name: 'candidate.applications' })
  } catch {
    Swal.fire('Error', 'Something went wrong with the server.', 'error')
  } finally {
    loading.value = false
  }
}
</script>
