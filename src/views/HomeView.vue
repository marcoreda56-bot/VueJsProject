<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useJobsStore } from '../stores/jobs'
import { useAuthStore } from '@/stores/auth.store'
import photo1 from '@/assets/photos/360_F_93006819_WJdNmNXktt5Sr8PcDM9HgcRMepmGrJCE.webp'
import photo2 from '@/assets/photos/depositphotos_8899050-stock-photo-applying-for-jobs-on-the.webp'
import photo3 from '@/assets/photos/man-holding-a-magnifying-glass-concept-job-search-recruitment-unemployment-vacancy-looking-for-a-new-career-or-want-an-additional-career-for-better-finance-free-photo.webp'

const jobStore = useJobsStore()
const authStore = useAuthStore()
const router = useRouter()

const slides = [
  { 
    image: photo1, 
    title: 'Find Your Next.', 
    subtitle: 'The premium job board for Egypt\'s tech elite. 🇪🇬',
    tag: '🚀 Future of Work'
  },
  { 
    image: photo2, 
    title: 'Career Growth.', 
    subtitle: 'Connecting top talent with world-class opportunities in Cairo.',
    tag: '📈 Rise Higher'
  },
  { 
    image: photo3, 
    title: 'Direct Access.', 
    subtitle: 'Skip the search and get headhunted by the region\'s best companies.',
    tag: '🎯 Direct Match'
  }
]

const currentSlide = ref(0)
let sliderInterval = null

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % slides.length
}

const prevSlide = () => {
  currentSlide.value = (currentSlide.value - 1 + slides.length) % slides.length
}

const startSlider = () => {
  sliderInterval = setInterval(nextSlide, 6000)
}

const stopSlider = () => {
  if (sliderInterval) clearInterval(sliderInterval)
}

const goToSlide = (index) => {
  currentSlide.value = index
  stopSlider()
  startSlider()
}

onMounted(async () => {
  if (authStore.isAuthenticated && authStore.user) {
    const role = authStore.user.role
    router.replace({ name: `${role}.dashboard` })
    return
  }
  await jobStore.initialize()
  startSlider()
})

onUnmounted(() => {
  stopSlider()
})

const goToJob = (id) => router.push(`/jobs/${id}`)
const goToCategory = (id) => router.push({ name: 'public.jobs', query: { category: id } })

const lucideToPrime = {
  'Code': { icon: 'pi pi-desktop', bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-600 dark:text-blue-400', border: 'border-blue-100 dark:border-blue-800' },
  'Palette': { icon: 'pi pi-palette', bg: 'bg-pink-50 dark:bg-pink-900/20', text: 'text-pink-600 dark:text-pink-400', border: 'border-pink-100 dark:border-pink-800' },
  'LayoutDashboard': { icon: 'pi pi-th-large', bg: 'bg-indigo-50 dark:bg-indigo-900/20', text: 'text-indigo-600 dark:text-indigo-400', border: 'border-indigo-100 dark:border-indigo-800' },
  'Megaphone': { icon: 'pi pi-megaphone', bg: 'bg-orange-50 dark:bg-orange-900/20', text: 'text-orange-600 dark:text-orange-400', border: 'border-orange-100 dark:border-orange-800' },
  'Database': { icon: 'pi pi-database', bg: 'bg-emerald-50 dark:bg-emerald-900/20', text: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-100 dark:border-emerald-800' },
  'Briefcase': { icon: 'pi pi-chart-line', bg: 'bg-purple-50 dark:bg-purple-900/20', text: 'text-purple-600 dark:text-purple-400', border: 'border-purple-100 dark:border-purple-800' },
  'Users': { icon: 'pi pi-users', bg: 'bg-cyan-50 dark:bg-cyan-900/20', text: 'text-cyan-600 dark:text-cyan-400', border: 'border-cyan-100 dark:border-cyan-800' },
  'Pencil': { icon: 'pi pi-pencil', bg: 'bg-amber-50 dark:bg-amber-900/20', text: 'text-amber-600 dark:text-amber-400', border: 'border-amber-100 dark:border-amber-800' }
}

const getCategoryStyle = (iconName) => {
  return lucideToPrime[iconName] || { 
    icon: 'pi pi-tag', 
    bg: 'bg-slate-50 dark:bg-slate-900/20', 
    text: 'text-slate-600 dark:text-slate-400',
    border: 'border-slate-100 dark:border-slate-800'
  }
}

</script>

<template>
  <div
    class="min-h-screen bg-[#FAFAFA] dark:bg-slate-950 font-['Outfit',sans-serif] selection:bg-indigo-100"
  >
    <div class="max-w-[1800px] mx-auto p-6">
      <!-- Hero Slider Section -->
      <section
        class="relative h-[600px] md:h-[700px] overflow-hidden rounded-[4rem] shadow-2xl shadow-indigo-500/10 group animate-[fadeIn_0.8s_ease-out]"
      >
        <!-- Slides -->
        <transition-group name="fade" tag="div" class="absolute inset-0">
          <div
            v-for="(slide, index) in slides"
            v-show="currentSlide === index"
            :key="index"
            class="absolute inset-0 bg-slate-900 flex items-center justify-center"
          >
            <!-- Background Image with Overlay -->
            <img 
              :src="slide.image" 
              class="absolute inset-0 w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform duration-[10s] ease-linear brightness-[0.4]"
              alt="Hero Slide"
            />
            
            <!-- Content -->
            <div class="relative z-20 w-full max-w-7xl mx-auto px-12 flex flex-col md:flex-row items-center justify-between gap-12">
              <div class="max-w-3xl text-center md:text-left">
                <div class="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/10 rounded-full mb-8">
                  <span class="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em]">{{ slide.tag }}</span>
                </div>
                
                <h1 class="text-6xl md:text-9xl font-black text-white tracking-tighter leading-[0.85] mb-8 italic">
                  {{ slide.title.split(' ')[0] }}<span class="text-indigo-500">{{ slide.title.split(' ')[1] }}</span>
                </h1>
                
                <p class="text-xl md:text-2xl text-slate-300 mb-12 max-w-xl font-medium leading-relaxed">
                  {{ slide.subtitle }}
                </p>

                <div class="flex flex-wrap gap-4 justify-center md:justify-start">
                  <button
                    @click="$router.push('/jobs')"
                    class="px-10 py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-indigo-600/20 transition-all active:scale-95 flex items-center gap-3"
                  >
                    <i class="pi pi-briefcase"></i>
                    Join Elite
                  </button>
                </div>
              </div>

              <!-- Decorative Glass Card -->
              <div class="hidden lg:block w-80 p-8 rounded-[2.5rem] bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rotate-3 hover:rotate-0 transition-all duration-500">
                <div class="flex items-center gap-4 mb-6">
                  <div class="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black">H</div>
                  <div>
                    <p class="text-[10px] font-black uppercase text-indigo-400 tracking-widest">Active Hiring</p>
                    <p class="text-sm font-bold text-white">HireMasr Elite</p>
                  </div>
                </div>
                <div class="space-y-4">
                  <div v-for="i in 3" :key="i" class="h-1 bg-white/10 rounded-full overflow-hidden">
                    <div class="h-full bg-indigo-500" :style="{ width: [70, 45, 90][i-1] + '%' }"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </transition-group>

        <!-- Slider Controls -->
        <div class="absolute bottom-12 left-1/2 -translate-x-1/2 z-30 flex items-center gap-4">
          <button 
            v-for="(_, index) in slides" 
            :key="index"
            @click="goToSlide(index)"
            class="w-12 h-1.5 rounded-full transition-all duration-500"
            :class="[currentSlide === index ? 'bg-indigo-500 w-20' : 'bg-white/20 hover:bg-white/40']"
          ></button>
        </div>

        <!-- Navigation Arrows -->
        <button 
          @click="prevSlide"
          class="absolute left-8 top-1/2 -translate-y-1/2 z-30 w-16 h-16 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-white hover:bg-indigo-600 hover:border-indigo-600 transition-all opacity-0 group-hover:opacity-100 hidden md:flex items-center justify-center"
        >
          <i class="pi pi-chevron-left text-xl"></i>
        </button>
        <button 
          @click="nextSlide"
          class="absolute right-8 top-1/2 -translate-y-1/2 z-30 w-16 h-16 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-white hover:bg-indigo-600 hover:border-indigo-600 transition-all opacity-0 group-hover:opacity-100 hidden md:flex items-center justify-center"
        >
          <i class="pi pi-chevron-right text-xl"></i>
        </button>
      </section>
    </div>

    <section class="max-w-[1800px] mx-auto px-10 py-20">
      <div class="flex items-center gap-4 mb-12">
        <div
          class="w-12 h-12 bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800 rounded-2xl flex items-center justify-center"
        >
          <i class="pi pi-th-large text-indigo-600 text-xl font-bold"></i>
        </div>
        <h2 class="text-4xl font-black text-slate-900 dark:text-white tracking-tighter italic">
          Browse Categories
        </h2>
      </div>

      <div class="flex gap-6 overflow-x-auto pb-8 snap-x no-scrollbar">
        <div
          v-for="cat in jobStore.categories"
          :key="cat.id"
          @click="goToCategory(cat.id)"
          class="snap-start min-w-[280px] p-8 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] text-center transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl hover:shadow-indigo-500/5 cursor-pointer group"
        >
          <div
            :class="[getCategoryStyle(cat.icon).bg, getCategoryStyle(cat.icon).border]"
            class="w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto mb-8 border transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-sm"
          >
            <i :class="[getCategoryStyle(cat.icon).icon, getCategoryStyle(cat.icon).text]" class="text-3xl"></i>
          </div>
          <h3 class="font-black text-xl text-slate-900 dark:text-white mb-2 tracking-tight">
            {{ cat.name }}
          </h3>
          <p class="text-slate-400 font-bold text-xs uppercase tracking-widest">
            {{ jobStore.jobCountByCategory(cat.id) }} Open Positions
          </p>
        </div>
      </div>
    </section>

    <section class="max-w-[1800px] mx-auto px-10 py-20">
      <div class="flex items-end justify-between mb-12">
        <div class="flex items-center gap-4">
          <div
            class="w-12 h-12 bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-900/30 rounded-2xl flex items-center justify-center"
          >
            <i class="pi pi-bolt text-amber-500 text-xl font-bold"></i>
          </div>
          <h2 class="text-4xl font-black text-slate-900 dark:text-white tracking-tighter italic">
            Featured Jobs
          </h2>
        </div>

        <button
          @click="$router.push('/jobs')"
          class="text-xs font-black uppercase tracking-[0.2em] text-slate-400 hover:text-indigo-600 transition-colors flex items-center gap-2 group"
        >
          View All <i class="pi pi-arrow-right group-hover:translate-x-1 transition-transform"></i>
        </button>
      </div>

      <div v-if="jobStore.loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div v-for="i in 6" :key="i" class="h-[320px] bg-slate-100 dark:bg-slate-900 rounded-[2.5rem] animate-pulse"></div>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div
          v-for="job in jobStore.featuredJobs()"
          :key="job.id"
          @click="goToJob(job.id)"
          class="p-8 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] hover:shadow-2xl hover:shadow-indigo-500/5 transition-all duration-500 group cursor-pointer"
        >
          <div class="flex justify-between items-start mb-8">
            <div
              class="w-14 h-14 bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl flex items-center justify-center border border-indigo-100/30 dark:border-indigo-500/20 group-hover:scale-110 transition-transform overflow-hidden"
            >
              <img 
                :src="`https://ui-avatars.com/api/?name=${job.company}&background=6366f1&color=fff&bold=true&font-size=0.4`" 
                :alt="job.company" 
                class="w-full h-full object-cover" 
              />
            </div>
            <span
              class="px-4 py-2 bg-slate-50 dark:bg-slate-800 text-[10px] font-black uppercase tracking-widest text-slate-400 rounded-xl border border-slate-100 dark:border-slate-700"
            >
              {{ job.type }}
            </span>
          </div>

          <h4
            class="text-2xl font-black text-slate-900 dark:text-white tracking-tighter mb-2 leading-none group-hover:text-indigo-600 transition-colors"
          >
            {{ job.title }}
          </h4>
          <p class="text-slate-400 font-bold text-sm mb-8 flex items-center gap-2">
            <i class="pi pi-building text-xs"></i> {{ job.company }}
          </p>

          <div
            class="pt-6 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between"
          >
            <span class="text-lg font-black text-indigo-600 tracking-tight">
              {{ job.salary_min }} - {{ job.salary_max }}
              <small class="text-[10px] opacity-60">{{ job.currency }}</small>
            </span>
            <div
              class="w-10 h-10 rounded-full bg-slate-900 dark:bg-indigo-600 text-white flex items-center justify-center shadow-lg group-hover:rotate-45 transition-transform"
            >
              <i class="pi pi-arrow-up-right text-sm"></i>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Call to Action -->
    <section class="max-w-[1800px] mx-auto p-10">
      <div
        class="bg-indigo-600 rounded-[3.5rem] p-16 md:p-24 text-center relative overflow-hidden shadow-2xl shadow-indigo-600/20"
      >
        <div class="absolute -top-24 -right-24 w-96 h-96 bg-white/10 blur-[120px] rounded-full"></div>
        <div class="absolute -bottom-24 -left-24 w-96 h-96 bg-black/10 blur-[100px] rounded-full"></div>

        <div class="relative z-10 max-w-2xl mx-auto">
          <h2 class="text-5xl md:text-7xl font-black text-white tracking-tighter italic mb-8">
            Ready to <span class="text-indigo-200">Elevate</span> Your Career?
          </h2>
          <p class="text-indigo-100 text-lg md:text-xl font-medium mb-12 leading-relaxed">
            Join the elite network of Egyptian tech professionals and get access to the most exclusive opportunities.
          </p>
          <div class="flex flex-wrap justify-center gap-6">
            <button
              @click="$router.push('/auth/register')"
              class="px-12 py-6 bg-white text-indigo-600 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl transition-all hover:-translate-y-1 active:scale-95"
            >
              Create Your Profile
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s ease-in-out;
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

.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
