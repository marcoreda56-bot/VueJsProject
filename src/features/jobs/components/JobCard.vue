<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'

const props = defineProps({
  job: { type: Object, required: true },
})

const router = useRouter()
const authStore = useAuthStore()

// تشيك هل اليوزر Guest ولا مسجل دخول
const isGuest = computed(() => !authStore.isAuthenticated)

const handleApply = () => {
  if (isGuest.value) {
    // لو زائر، ابعته يسجل دخول ورجعه تاني لنفس الوظيفة
    router.push({
      name: 'login',
      query: { redirect: `/apply/${props.job.id}` },
    })
  } else {
    // لو مسجل، وديه صفحة التقديم فوراً
    router.push({ name: 'jobs.apply', params: { id: props.job.id } })
  }
}
</script>

<template>
  <div
    class="group bg-white border border-gray-100 p-6 rounded-[2rem] shadow-sm hover:shadow-xl hover:shadow-gray-200/50 hover:border-black/5 transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between"
  >
    <div>
      <div class="flex justify-between items-start mb-6">
        <div
          class="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100 group-hover:scale-110 transition-transform duration-300"
        >
          <span class="text-xl font-black text-gray-900">{{
            job.company_name?.charAt(0) || 'J'
          }}</span>
        </div>
        <span
          class="px-4 py-1.5 bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-gray-100"
        >
          {{ job.type || 'Full Time' }}
        </span>
      </div>

      <h3 class="text-xl font-black text-gray-900 leading-tight mb-2 group-hover:text-black">
        {{ job.title }}
      </h3>
      <p class="text-gray-400 font-bold text-sm mb-4">
        {{ job.company_name }} • {{ job.location }}
      </p>

      <div class="flex flex-wrap gap-2 mb-8">
        <span class="text-[11px] font-bold text-gray-500 bg-gray-50 px-3 py-1 rounded-lg">
          💰 {{ job.salary_range || 'Competitive' }}
        </span>
        <span class="text-[11px] font-bold text-gray-500 bg-gray-50 px-3 py-1 rounded-lg">
          ⚡ {{ job.category || 'Tech' }}
        </span>
      </div>
    </div>

    <div class="flex items-center gap-3 pt-6 border-t border-gray-50">
      <button
        @click="handleApply"
        class="flex-1 py-3.5 bg-black text-white text-sm font-black rounded-xl hover:bg-gray-800 transition-all active:scale-95 shadow-lg shadow-black/5"
      >
        {{ isGuest ? 'Login to Apply' : 'Apply Now' }}
      </button>

      <router-link
        :to="{ name: 'job.detail', params: { id: job.id } }"
        class="p-3.5 bg-gray-50 text-gray-400 rounded-xl hover:bg-gray-100 hover:text-black transition-all"
      >
        <span class="text-sm font-black">Details</span>
      </router-link>
    </div>
  </div>
</template>
