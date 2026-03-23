<template>
  <div class="p-4 mx-auto min-h-screen transition-all duration-500" style="max-width: 1300px">
    <section
      class="hero-section text-center mb-8 py-8 px-4 border-round-3xl shadow-8 text-white relative overflow-hidden"
    >
      <div class="glow-1"></div>
      <div class="glow-2"></div>

      <div class="relative z-1 py-5">
        <Tag
          value="🚀 Future of Work"
          severity="warning"
          class="mb-4 px-3 border-round-pill bg-white-alpha-20 text-white border-none"
        />

        <h1 class="text-6xl md:text-8xl font-800 mb-3 tracking-tighter line-height-1">
          Hire<span class="text-yellow-400">Masr</span>
        </h1>

        <p
          class="text-xl md:text-3xl opacity-90 mb-6 line-height-3 max-w-40rem mx-auto font-medium"
        >
          The premium job board for Egypt's tech elite. 🇪🇬
        </p>

        <div class="flex justify-content-center gap-3">
          <Button
            label="Explore Jobs"
            icon="pi pi-briefcase"
            class="p-button-lg px-6 border-round-pill shadow-4 bg-white text-primary border-none font-bold"
            @click="$router.push('/jobs')"
          />
        </div>
      </div>
    </section>

    <div class="mb-8 section-fade-in">
      <h2 class="text-3xl font-800 mb-5 px-2 tracking-tight flex align-items-center gap-3">
        <i class="pi pi-th-large text-primary text-2xl"></i> Browse Categories
      </h2>

      <div class="flex gap-4 overflow-x-auto pb-4 scroll-hide px-2">
        <div
          v-for="cat in jobStore.categories"
          :key="cat.id"
          @click="goToCategory(cat.id)"
          class="category-card p-4 border-round-2xl glass-card text-center min-w-15rem transition-all"
        >
          <div class="icon-box mb-3 mx-auto">
            <i :class="cat.icon || 'pi pi-tag'" class="text-3xl text-primary"></i>
          </div>
          <div class="font-800 text-xl mb-1">{{ cat.name }}</div>
          <div class="text-500 font-bold text-sm">
            {{ jobStore.jobCountByCategory(cat.id) }} Open Positions
          </div>
        </div>
      </div>
    </div>

    <div class="mb-8 section-fade-in">
      <div class="flex justify-content-between align-items-end mb-5 px-2">
        <h2 class="text-3xl font-800 m-0 tracking-tight flex align-items-center gap-3">
          <i class="pi pi-bolt text-yellow-500 text-3xl"></i> Featured Jobs
        </h2>

        <Button
          label="View All"
          icon="pi pi-arrow-right"
          iconPos="right"
          text
          class="font-bold hover:translate-x-2 transition-all"
          @click="$router.push('/jobs')"
        />
      </div>

      <div v-if="jobStore.loading" class="grid">
        <div v-for="i in 6" :key="i" class="col-12 md:col-6 lg:col-4 p-3">
          <Skeleton height="250px" borderRadius="24px" />
        </div>
      </div>

      <div v-else class="grid">
        <div
          v-for="job in jobStore.featuredJobs()"
          :key="job.id"
          class="col-12 md:col-6 lg:col-4 p-3"
        >
          <div
            class="job-card p-5 border-round-3xl glass-card transition-all h-full flex flex-column"
          >
            <div class="flex align-items-start justify-content-between mb-4">
              <div class="flex gap-3">
                <Avatar
                  :label="job.company?.charAt(0) || 'C'"
                  size="large"
                  shape="circle"
                  class="bg-primary-100 text-primary font-bold shadow-sm"
                />
                <div>
                  <h4 class="m-0 text-xl font-800 line-height-1 mb-1">{{ job.title }}</h4>
                  <span class="text-500 font-semibold text-sm">
                    <i class="pi pi-building text-xs mr-1"></i> {{ job.company || 'Tech Corp' }}
                  </span>
                </div>
              </div>
            </div>

            <div class="flex gap-2 mb-5 flex-wrap">
              <Tag :value="job.type" class="px-3 border-round-pill glass-tag font-bold" />
              <Tag
                :value="job.location"
                class="px-3 border-round-pill glass-tag font-bold opacity-80"
              />
            </div>

            <div
              class="mt-auto flex justify-content-between align-items-center pt-3 border-top-1 border-alpha-10"
            >
              <div>
                <span class="text-xl font-800 text-primary">
                  {{ job.salary_min }} - {{ job.salary_max }} <small>{{ job.currency }}</small>
                </span>
              </div>
              <Button
                icon="pi pi-arrow-up-right"
                rounded
                class="h-3rem w-3rem shadow-4"
                @click="goToJob(job.id)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useJobsStore } from '../stores/jobs'
import { useAuthStore } from '@/stores/auth.store' // استدعاء مخزن المصادقة

// استيراد مكونات PrimeVue
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import Skeleton from 'primevue/skeleton'
import Avatar from 'primevue/avatar'

const jobStore = useJobsStore()
const authStore = useAuthStore()
const router = useRouter()

const goToJob = (id) => router.push(`/jobs/${id}`)
const goToCategory = (id) => router.push({ name: 'public.jobs', query: { categoryId: id } })

onMounted(() => {
  // 🛡️ فحص التوجيه الذكي قبل تحميل أي بيانات
  if (authStore.isAuthenticated && authStore.user) {
    const role = authStore.user.role
    // تحويل المستخدم لبيته (candidate.dashboard / employer.dashboard / admin.dashboard)
    router.replace({ name: `${role}.dashboard` })
    return // الخروج من الدالة لمنع أي تحميل إضافي
  }

  // تحميل البيانات للزوار فقط
  jobStore.initialize()
})
</script>

<style scoped>
/* 🌑 Hero Styling */
.hero-section {
  background: linear-gradient(135deg, #4f46e5 0%, #1e1b4b 100%);
}

.glow-1 {
  position: absolute;
  top: -100px;
  right: -100px;
  width: 400px;
  height: 400px;
  background: rgba(99, 102, 241, 0.4);
  filter: blur(100px);
  border-radius: 50%;
}
.glow-2 {
  position: absolute;
  bottom: -50px;
  left: -50px;
  width: 300px;
  height: 300px;
  background: rgba(168, 85, 247, 0.3);
  filter: blur(80px);
  border-radius: 50%;
}

/* 💎 Essential Glassmorphism */
.glass-card {
  background: var(--card-bg, rgba(255, 255, 255, 0.8));
  border: 1px solid var(--border-color, rgba(0, 0, 0, 0.05));
  backdrop-filter: blur(12px);
  color: var(--text-main, #1e1b4b);
  box-shadow: 0 4px 20px -1px rgba(0, 0, 0, 0.05);
}

.icon-box {
  width: 60px;
  height: 60px;
  background: var(--bg-color, #f8fafc);
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--border-color, rgba(0, 0, 0, 0.05));
}

.glass-tag {
  background: var(--bg-color, #f8fafc);
  color: var(--text-main, #1e1b4b);
  border: 1px solid var(--border-color, rgba(0, 0, 0, 0.05));
}

/* Hover effects */
.category-card:hover,
.job-card:hover {
  transform: translateY(-8px);
  border-color: var(--primary, #4f46e5);
  box-shadow: 0 20px 30px -10px rgba(0, 0, 0, 0.2);
}

/* Animations */
.section-fade-in {
  animation: fadeIn 0.8s ease-out forwards;
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

.scroll-hide::-webkit-scrollbar {
  display: none;
}

h2,
h4 {
  color: var(--text-main, #1e1b4b);
}
.hero-section h1,
.hero-section p {
  color: white !important;
}
.border-alpha-10 {
  border-color: var(--border-color, rgba(0, 0, 0, 0.05)) !important;
}
</style>
