<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useJobStore } from '@/stores/JobStore'
import { useTaxonomyStore } from '@/stores/TaxonomyStore'

import photo1 from '@/assets/photos/360_F_93006819_WJdNmNXktt5Sr8PcDM9HgcRMepmGrJCE.webp'
import photo2 from '@/assets/photos/depositphotos_8899050-stock-photo-applying-for-jobs-on-the.webp'
import photo3 from '@/assets/photos/man-holding-a-magnifying-glass-concept-job-search-recruitment-unemployment-vacancy-looking-for-a-new-career-or-want-an-additional-career-for-better-finance-free-photo.webp'

const jobStore = useJobStore()
const taxonomyStore = useTaxonomyStore()
const router = useRouter()

const slides = [
  {
    image: photo1,
    title: 'Find Your Next.',
    subtitle: "The premium job board for Egypt's tech elite. 🇪🇬",
    tag: '🚀 Future of Work',
  },
  {
    image: photo2,
    title: 'Career Growth.',
    subtitle: 'Connecting top talent with world-class opportunities.',
    tag: '📈 Rise Higher',
  },
  {
    image: photo3,
    title: 'Direct Access.',
    subtitle: 'Skip the search and get headhunted.',
    tag: '🎯 Direct Match',
  },
]

const currentSlide = ref(0)
let sliderInterval = null

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % slides.length
}
const startSlider = () => {
  sliderInterval = setInterval(nextSlide, 6000)
}
const stopSlider = () => {
  if (sliderInterval) clearInterval(sliderInterval)
}

onMounted(async () => {
  await Promise.all([jobStore.fetchJobs({ limit: 6 }), taxonomyStore.fetchCategories()])
  startSlider()
})

onUnmounted(() => stopSlider())

const goToJob = (slug) => router.push(`/jobs/${slug}`)
</script>

<template>
  <div class="min-h-screen bg-[#FAFAFA] dark:bg-slate-950 font-['Outfit']">
    <div class="max-w-450 mx-auto p-6">
      <section
        class="relative h-162.5 overflow-hidden rounded-[4rem] shadow-2xl group animate-[fadeIn_0.8s]"
      >
        <transition-group name="fade" tag="div">
          <div
            v-for="(slide, index) in slides"
            v-show="currentSlide === index"
            :key="index"
            class="absolute inset-0 bg-slate-900"
          >
            <img
              :src="slide.image"
              class="absolute inset-0 w-full h-full object-cover brightness-[0.35]"
            />
            <div class="relative z-20 w-full max-w-7xl mx-auto px-12 flex items-center h-full">
              <div class="max-w-3xl">
                <div
                  class="inline-flex px-4 py-2 bg-white/10 backdrop-blur-md rounded-full mb-8 border border-white/10"
                >
                  <span class="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{{
                    slide.tag
                  }}</span>
                </div>
                <h1
                  class="text-7xl md:text-9xl font-black text-white tracking-tighter italic mb-8 leading-none"
                >
                  {{ slide.title.split(' ')[0]
                  }}<span class="text-indigo-500">{{ slide.title.split(' ')[1] }}</span>
                </h1>
                <p class="text-xl text-slate-300 mb-12 max-w-xl font-medium leading-relaxed">
                  {{ slide.subtitle }}
                </p>
                <button
                  @click="$router.push('/jobs')"
                  class="px-10 py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl hover:bg-indigo-500 transition-all"
                >
                  Join Elite
                </button>
              </div>
            </div>
          </div>
        </transition-group>
      </section>
    </div>

    <!-- Featured Jobs Preview -->
    <section class="max-w-450 mx-auto px-10 py-20">
      <h2 class="text-4xl font-black text-slate-900 mb-12 italic tracking-tighter">
        Featured Opportunities
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div
          v-for="job in jobStore.jobs"
          :key="job.id"
          @click="goToJob(job.id)"
          class="p-8 bg-white border border-slate-100 rounded-[2.5rem] hover:shadow-2xl transition-all cursor-pointer group"
        >
          <div class="w-14 h-14 bg-indigo-50 rounded-2xl mb-6 overflow-hidden">
            <img
              :src="
                job.employer?.logo ||
                `https://ui-avatars.com/api/?name=${job.employer?.company_name}`
              "
              class="w-full h-full object-cover"
            />
          </div>
          <h4 class="text-2xl font-black text-slate-900 mb-2 group-hover:text-indigo-600">
            {{ job.title }}
          </h4>
          <p class="text-slate-400 font-bold text-sm mb-6">{{ job.employer?.company_name }}</p>
          <div class="pt-6 border-t border-slate-50 flex justify-between items-center">
            <span class="font-black text-indigo-600">{{ job.salary_min }} {{ job.currency }}</span>
            <i
              class="pi pi-arrow-up-right text-slate-300 group-hover:rotate-45 transition-transform"
            ></i>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1.2s ease-in-out;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
