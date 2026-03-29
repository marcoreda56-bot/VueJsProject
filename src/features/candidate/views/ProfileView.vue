<template>
  <div class="p-8 lg:p-12 animate-[fadeIn_0.5s_ease-out] max-w-6xl mx-auto">
    <header class="mb-12 flex justify-between items-center">
      <div>
        <h1 class="text-4xl font-black text-slate-900 dark:text-white tracking-tighter italic mb-2">
          My <span class="text-indigo-600">Profile</span>
        </h1>
        <p class="text-slate-400 font-bold text-xs uppercase tracking-[0.2em]">
          Manage your professional identity
        </p>
      </div>
      <button
        @click="saveProfile"
        :disabled="saving"
        class="group relative px-10 py-4 bg-slate-900 dark:bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] overflow-hidden transition-all hover:shadow-2xl hover:shadow-indigo-500/20 active:scale-95 disabled:opacity-50"
      >
        <span class="relative z-10 flex items-center gap-2">
          <i v-if="saving" class="pi pi-spin pi-spinner"></i>
          <i v-else class="pi pi-check"></i>
          {{ saving ? 'Saving...' : 'Save Profile' }}
        </span>
      </button>
    </header>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div class="lg:col-span-4 space-y-6">
        <div
          class="p-10 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[3rem] text-center shadow-sm"
        >
          <div class="relative w-32 h-32 mx-auto mb-6 group">
            <img
              :src="userAvatar"
              class="w-full h-full object-cover rounded-[2.5rem] shadow-2xl transition-transform group-hover:scale-105"
              alt="Profile Picture"
            />
            <div
              class="absolute inset-0 bg-black/40 rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
            >
              <i class="pi pi-camera text-white text-xl"></i>
            </div>
          </div>
          <h3 class="text-xl font-black text-slate-900 dark:text-white mb-1">
            {{ auth.user?.name }}
          </h3>
          <span
            class="px-4 py-1.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest"
          >
            {{ formData.title || 'Candidate' }}
          </span>
        </div>
      </div>

      <div class="lg:col-span-8">
        <div
          class="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[3rem] p-10 shadow-sm"
        >
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div
              v-for="field in fields"
              :key="field.label"
              :class="field.full ? 'md:col-span-2' : ''"
            >
              <label
                class="block text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-4 ml-2"
              >
                {{ field.label }}
              </label>

              <input
                v-if="field.type !== 'textarea'"
                v-model="formData[field.key]"
                :type="field.type"
                class="w-full px-8 py-5 bg-slate-50 dark:bg-slate-800/50 border border-transparent focus:border-indigo-500/30 focus:bg-white dark:focus:bg-slate-800 rounded-[1.5rem] outline-none transition-all font-bold text-slate-700 dark:text-slate-200"
                :placeholder="field.placeholder"
              />

              <textarea
                v-else
                v-model="formData[field.key]"
                rows="5"
                class="w-full px-8 py-5 bg-slate-50 dark:bg-slate-800/50 border border-transparent focus:border-indigo-500/30 focus:bg-white dark:focus:bg-slate-800 rounded-[2rem] outline-none transition-all font-medium text-slate-600 dark:text-slate-300"
                placeholder="Write your professional story..."
              ></textarea>
            </div>

            <div class="md:col-span-2 mt-4 border-t border-slate-50 dark:border-slate-800 pt-8">
              <label
                class="block text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6 ml-2"
              >
                Technical Skills
              </label>

              <div class="flex flex-wrap gap-3 mb-6">
                <span
                  v-for="(skill, index) in formData.skills"
                  :key="index"
                  class="group px-5 py-2.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 rounded-xl text-[10px] font-black uppercase flex items-center gap-3 transition-all hover:bg-indigo-600 hover:text-white"
                >
                  {{ skill }}
                  <i
                    @click="removeSkill(index)"
                    class="pi pi-times cursor-pointer text-[8px] opacity-50 group-hover:opacity-100"
                  ></i>
                </span>

                <div v-if="formData.skills.length === 0" class="text-slate-300 italic text-xs ml-2">
                  No skills added yet...
                </div>
              </div>

              <div class="relative">
                <input
                  v-model="skillInput"
                  @keyup.enter="addSkill"
                  class="w-full px-8 py-5 bg-slate-50 dark:bg-slate-800/50 border border-transparent focus:border-indigo-500/30 focus:bg-white dark:focus:bg-slate-800 rounded-[1.5rem] outline-none transition-all font-bold text-slate-700 dark:text-slate-200"
                  placeholder="Type a skill and press Enter (e.g. Vue.js, Node.js)"
                />
                <button
                  @click="addSkill"
                  class="absolute right-4 top-1/2 -translate-y-1/2 p-3 text-indigo-500 hover:text-indigo-700 transition-colors"
                >
                  <i class="pi pi-plus"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted, ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth.store'
import { useCandidateStore } from '@/stores/candidate.store'
import Swal from 'sweetalert2'

const auth = useAuthStore()
const candidateStore = useCandidateStore()
const saving = ref(false)
const skillInput = ref('')

const fields = [
  {
    label: 'Job Title',
    key: 'title',
    type: 'text',
    placeholder: 'e.g. Senior Full-Stack Engineer',
  },
  { label: 'Location', key: 'location', type: 'text', placeholder: 'e.g. Cairo, Egypt' },
  { label: 'Professional Bio', key: 'bio', type: 'textarea', placeholder: '', full: true },
]

const formData = reactive({
  title: '',
  location: '',
  bio: '',
  skills: [],
})

onMounted(async () => {
  await candidateStore.initialize()
  if (candidateStore.profile) {
    Object.assign(formData, {
      title: candidateStore.profile.title || '',
      location: candidateStore.profile.location || '',
      bio: candidateStore.profile.bio || '',
      skills: Array.isArray(candidateStore.profile.skills)
        ? [...candidateStore.profile.skills]
        : [],
    })
  }
})

const userAvatar = computed(() => {
  if (auth.user?.avatar) return auth.user.avatar
  const name = auth.user?.name || 'User'
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366f1&color=fff&bold=true`
})

const addSkill = () => {
  const val = skillInput.value.trim()
  if (val && !formData.skills.includes(val)) {
    formData.skills.push(val)
    skillInput.value = ''
  }
}

const removeSkill = (index) => {
  formData.skills.splice(index, 1)
}

const saveProfile = async () => {
  saving.value = true
  try {
    await candidateStore.updateProfile({
      ...candidateStore.profile,
      ...formData,
    })

    Swal.fire({
      title: 'Profile Updated!',
      text: 'Your professional presence is now live.',
      icon: 'success',
      confirmButtonColor: '#6366f1',
      customClass: { popup: 'rounded-[2.5rem] font-sans' },
    })
  } catch (err) {
    console.error('Save Error:', err)
    Swal.fire('Error', "We couldn't save your changes. Try again.", 'error')
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
