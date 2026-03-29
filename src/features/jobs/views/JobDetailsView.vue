<template>
  <div
    v-if="job"
    class="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 py-12 px-6 font-['Plus_Jakarta_Sans']"
  >
    <div class="max-w-5xl mx-auto">
      <button
        @click="$router.back()"
        class="group flex items-center gap-3 text-slate-400 hover:text-indigo-600 transition-all mb-10 font-black text-[10px] uppercase tracking-[0.2em]"
      >
        <div
          class="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-800 flex items-center justify-center group-hover:border-indigo-600 transition-colors"
        >
          <i class="pi pi-arrow-left text-[8px]"></i>
        </div>
        Back
      </button>

      <div
        class="bg-white dark:bg-slate-900 rounded-[4rem] p-10 md:p-16 shadow-sm border border-slate-100 dark:border-slate-800 relative overflow-hidden"
      >
        <div
          class="absolute -top-20 -right-20 w-80 h-80 bg-indigo-500/5 blur-[100px] rounded-full"
        ></div>

        <div
          class="flex flex-col md:flex-row justify-between items-start gap-8 mb-16 relative z-10"
        >
          <div class="flex items-center gap-8">
            <div
              class="w-24 h-24 bg-slate-900 dark:bg-slate-800 rounded-[2rem] flex items-center justify-center text-white text-4xl font-black italic shadow-2xl shadow-indigo-500/20"
            >
              {{ job.title.charAt(0) }}
            </div>
            <div>
              <h1
                class="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter italic mb-3 leading-none"
              >
                {{ job.title }}
              </h1>
              <div class="flex items-center gap-3">
                <p class="text-indigo-600 font-black text-[11px] uppercase tracking-[0.2em]">
                  {{ companyName }}
                </p>
                <span class="w-1.5 h-1.5 rounded-full bg-slate-200"></span>
                <p
                  class="text-slate-400 font-bold text-[11px] uppercase tracking-widest flex items-center gap-2"
                >
                  <i class="pi pi-map-marker text-[10px]"></i> {{ job.location }}
                </p>
              </div>
            </div>
          </div>

          <div
            class="px-8 py-3 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em]"
          >
            {{ job.type }}
          </div>
        </div>

        <div
          class="grid grid-cols-1 lg:grid-cols-12 gap-16 border-t border-slate-50 dark:border-slate-800 pt-16 relative z-10"
        >
          <div class="lg:col-span-8 space-y-12">
            <section>
              <h3
                class="text-[10px] font-black uppercase text-slate-400 tracking-[0.4em] mb-6 flex items-center gap-3"
              >
                <span class="w-8 h-[2px] bg-indigo-500"></span> Role Description
              </h3>
              <p
                class="text-slate-600 dark:text-slate-400 leading-[1.8] font-medium text-lg italic"
              >
                {{ job.description }}
              </p>
            </section>

            <section>
              <h3
                class="text-[10px] font-black uppercase text-slate-400 tracking-[0.4em] mb-6 flex items-center gap-3"
              >
                <span class="w-8 h-[2px] bg-indigo-500"></span> Requirements
              </h3>
              <div
                class="bg-slate-50 dark:bg-slate-800/40 p-10 rounded-[3rem] font-bold text-sm text-slate-600 dark:text-slate-400 leading-loose border border-slate-100 dark:border-slate-800"
              >
                <p class="whitespace-pre-line">{{ job.requirements }}</p>
              </div>
            </section>
          </div>

          <div class="lg:col-span-4 space-y-6">
            <div
              class="sticky top-10 bg-slate-900 dark:bg-slate-800 p-10 rounded-[3rem] shadow-2xl text-white"
            >
              <p class="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400 mb-2">
                Package Range
              </p>
              <h4 class="text-3xl font-black mb-8 italic tracking-tighter">
                {{ job.salary_min?.toLocaleString() }} - {{ job.salary_max?.toLocaleString() }}
                <span class="text-sm block mt-1 text-slate-400 not-italic"
                  >{{ job.currency }} / Monthly</span
                >
              </h4>

              <button
                @click="checkAndOpenModal"
                :disabled="hasApplied"
                class="w-full py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-xl"
                :class="
                  hasApplied
                    ? 'bg-slate-700 text-slate-500 cursor-not-allowed shadow-none'
                    : 'bg-indigo-600 hover:bg-white hover:text-slate-900 shadow-indigo-500/20 active:scale-95'
                "
              >
                <i :class="hasApplied ? 'pi pi-check-circle' : 'pi pi-bolt'"></i>
                {{ hasApplied ? 'Already Tracked' : 'Easy Apply Now' }}
              </button>

              <p
                v-if="hasApplied"
                class="text-center text-[10px] font-bold text-emerald-400 mt-4 uppercase tracking-widest"
              >
                Application is being reviewed
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <Transition name="fade">
      <div
        v-if="showApplyModal"
        class="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-md"
      >
        <div
          class="bg-white dark:bg-slate-900 w-full max-w-xl rounded-[4rem] p-12 shadow-2xl relative border border-slate-100 dark:border-slate-800"
        >
          <div class="text-center mb-10">
            <div
              class="w-20 h-20 bg-indigo-600 text-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-200 dark:shadow-none"
            >
              <i class="pi pi-paper-plane text-2xl"></i>
            </div>
            <h2 class="text-3xl font-black text-slate-900 dark:text-white tracking-tighter italic">
              Confirm Application
            </h2>
            <p class="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mt-3 italic">
              Applying to <span class="text-indigo-600">{{ companyName }}</span>
            </p>
          </div>

          <div class="relative mb-10">
            <label
              class="absolute -top-3 left-8 bg-white dark:bg-slate-900 px-4 text-[10px] font-black text-indigo-500 uppercase tracking-widest z-10 italic"
            >
              The Pitch
            </label>
            <textarea
              v-model="coverLetter"
              placeholder="Tell them why you're the perfect fit for this track..."
              class="w-full h-48 p-10 bg-slate-50 dark:bg-slate-800 rounded-[2.5rem] border-2 border-transparent focus:border-indigo-500/30 focus:bg-white dark:focus:bg-slate-800 outline-none transition-all font-medium text-sm text-slate-700 dark:text-slate-300 resize-none shadow-inner"
            ></textarea>
          </div>

          <div class="space-y-4">
            <button
              @click="submitApplication"
              :disabled="isApplying"
              class="w-full py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black uppercase tracking-widest transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
            >
              <i v-if="isApplying" class="pi pi-spin pi-spinner"></i>
              <i v-else class="pi pi-bolt"></i>
              {{ isApplying ? 'Processing...' : 'Confirm & Apply' }}
            </button>

            <button
              @click="showApplyModal = false"
              class="w-full py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-rose-500 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useJobsStore } from '@/stores/jobs'
import { useCandidateStore } from '@/stores/candidate.store'
import { useAuthStore } from '@/stores/auth.store'
import Swal from 'sweetalert2'

const route = useRoute()
const router = useRouter()
const jobsStore = useJobsStore()
const candidateStore = useCandidateStore()
const authStore = useAuthStore()

const showApplyModal = ref(false)
const isApplying = ref(false)
const coverLetter = ref('')

const job = computed(() => jobsStore.jobs.find((j) => String(j.id) === String(route.params.id)))

const companyName = computed(() => {
  const emp = jobsStore.employers.find((e) => String(e.id) === String(job.value?.employer_id))
  return emp?.company_name || 'HireMasr Partner'
})

const hasApplied = computed(() => {
  return candidateStore.applications.some((app) => String(app.job_id) === String(job.value?.id))
})

onMounted(async () => {
  if (jobsStore.jobs.length === 0) await jobsStore.initialize()
  if (authStore.isAuthenticated && candidateStore.applications.length === 0) {
    await candidateStore.initialize()
  }
})

const checkAndOpenModal = () => {
  if (!authStore.isAuthenticated) {
    return router.push({
      name: 'login',
      query: { redirect: route.fullPath },
    })
  }
  showApplyModal.value = true
}

const submitApplication = async () => {
  if (!coverLetter.value) {
    Swal.fire({
      title: 'Wait!',
      text: 'Adding a quick pitch helps you stand out.',
      icon: 'warning',
      confirmButtonColor: '#6366f1',
    })
    return
  }

  try {
    isApplying.value = true
    await candidateStore.applyForJob(job.value.id, coverLetter.value)

    showApplyModal.value = false
    coverLetter.value = ''

    Swal.fire({
      icon: 'success',
      title: 'Track Submitted!',
      text: `Your application to ${companyName.value} is now live.`,
      confirmButtonColor: '#6366f1',
      timer: 3000,
    })
  } catch (error) {
    Swal.fire({
      title: 'Error',
      text: error.message || 'Something went wrong. Check your connection.',
      icon: 'error',
      confirmButtonColor: '#6366f1',
    })
  } finally {
    isApplying.value = false
  }
}
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
