<script setup>
import { ref, reactive } from 'vue'
import { useAuthStore } from '@/stores/auth.store'

const auth = useAuthStore()
const user = auth.user // بنجيب بيانات اليوزر اللي مسجل دخول

const isEditing = ref(false)

// بيانات تجريبية (ممكن نربطها بالـ API بعدين)
const profile = reactive({
  name: user?.name || 'Marco Reda',
  title: 'Full Stack Developer',
  bio: 'Passionate about building clean, scalable web applications with Vue.js and Node.js.',
  location: 'Cairo, Egypt',
  skills: ['Vue.js', 'Tailwind CSS', 'Node.js', 'PostgreSQL', 'Bash Scripting'],
  experience: [{ id: 1, company: 'Freelance', role: 'Full Stack Dev', period: '2025 - Present' }],
})

const saveProfile = () => {
  isEditing.value = false
  // هنا هننادي على profilesApi.updateCandidate بعدين
  console.log('Saved!', profile)
}
</script>

<template>
  <div class="max-w-4xl mx-auto py-12 px-4 animate-in fade-in slide-in-from-bottom-5 duration-700">
    <div
      class="bg-white border border-gray-100 rounded-[2.5rem] p-8 md:p-12 shadow-sm mb-8 flex flex-col md:flex-row items-center gap-8"
    >
      <div
        class="w-32 h-32 bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200 flex items-center justify-center text-4xl group hover:border-black transition-colors cursor-pointer"
      >
        📸
      </div>

      <div class="flex-1 text-center md:text-left">
        <h1 class="text-4xl font-black text-gray-900 tracking-tighter">{{ profile.name }}</h1>
        <p class="text-gray-400 font-bold text-lg mt-1">{{ profile.title }}</p>
        <div class="flex flex-wrap justify-center md:justify-start gap-4 mt-4">
          <span
            class="text-xs font-black uppercase tracking-widest text-gray-400 flex items-center gap-1"
          >
            📍 {{ profile.location }}
          </span>
          <span
            class="text-xs font-black uppercase tracking-widest text-gray-400 flex items-center gap-1"
          >
            📧 {{ user?.email || 'marco@example.com' }}
          </span>
        </div>
      </div>

      <button
        @click="isEditing = !isEditing"
        class="px-6 py-3 border-2 border-black rounded-xl font-black text-sm hover:bg-black hover:text-white transition-all active:scale-95"
      >
        {{ isEditing ? 'Cancel' : 'Edit Profile' }}
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div class="space-y-8">
        <div class="bg-white border border-gray-100 rounded-[2rem] p-6 shadow-sm">
          <h3 class="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-6">Skills</h3>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="skill in profile.skills"
              :key="skill"
              class="px-4 py-2 bg-gray-50 text-gray-900 text-xs font-black rounded-xl border border-gray-100 hover:border-black transition-colors cursor-default"
            >
              {{ skill }}
            </span>
          </div>
        </div>
      </div>

      <div class="md:col-span-2 space-y-8">
        <div class="bg-white border border-gray-100 rounded-[2rem] p-8 shadow-sm">
          <h3 class="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-6">About Me</h3>
          <div v-if="!isEditing">
            <p class="text-gray-600 leading-relaxed font-medium text-lg">
              {{ profile.bio }}
            </p>
          </div>
          <div v-else class="space-y-4">
            <textarea
              v-model="profile.bio"
              rows="4"
              class="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-black outline-none transition-all font-medium"
            ></textarea>
            <button
              @click="saveProfile"
              class="px-8 py-3 bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition-all"
            >
              Save Bio
            </button>
          </div>
        </div>

        <div class="bg-white border border-gray-100 rounded-[2rem] p-8 shadow-sm">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Experience</h3>
            <button class="text-[10px] font-black uppercase tracking-widest text-black underline">
              + Add New
            </button>
          </div>

          <div class="space-y-8">
            <div v-for="exp in profile.experience" :key="exp.id" class="flex gap-6 items-start">
              <div
                class="w-12 h-12 bg-gray-900 text-white rounded-xl flex items-center justify-center font-black"
              >
                {{ exp.company.charAt(0) }}
              </div>
              <div>
                <h4 class="font-black text-gray-900 text-xl">{{ exp.role }}</h4>
                <p class="text-gray-500 font-bold text-sm">{{ exp.company }} • {{ exp.period }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* حركات دخول خفيفة */
.animate-in {
  animation-fill-mode: both;
}
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.slide-in-from-bottom-5 {
  animation: slideIn 0.6s ease-out;
}
</style>
