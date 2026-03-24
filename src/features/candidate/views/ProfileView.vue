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
        class="group relative px-10 py-4 bg-slate-900 dark:bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] overflow-hidden transition-all hover:shadow-2xl hover:shadow-indigo-500/20 active:scale-95"
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
                >{{ field.label }}</label
              >

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

const fields = [
  { label: 'Job Title', key: 'title', type: 'text', placeholder: 'e.g. Senior Frontend Developer' },
  { label: 'Location', key: 'location', type: 'text', placeholder: 'e.g. Cairo, Egypt' },
  { label: 'Professional Bio', key: 'bio', type: 'textarea', placeholder: '', full: true },
]

const formData = reactive({ title: '', location: '', bio: '' })

onMounted(async () => {
  await candidateStore.initialize()
  if (candidateStore.profile) {
    Object.assign(formData, {
      title: candidateStore.profile.title || '',
      location: candidateStore.profile.location || '',
      bio: candidateStore.profile.bio || '',
    })
  }
})

const userAvatar = computed(() => {
  if (auth.user?.avatar) {
    return auth.user.avatar
  }

  const name = auth.user?.name || 'User'
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366f1&color=fff&bold=true`
})
const saveProfile = async () => {
  saving.value = true
  try {
    await candidateStore.updateProfile({ ...candidateStore.profile, ...formData })

    Swal.fire({
      title: 'Success!',
      text: 'Your profile has been polished.',
      icon: 'success',
      confirmButtonColor: '#6366f1',
      buttonsStyling: true,
      customClass: { popup: 'rounded-[2rem] font-["Plus_Jakarta_Sans"]' },
    })
  } catch (err) {
    Swal.fire('Error', 'Something went wrong', 'error')
  } finally {
    saving.value = false
  }
}
</script>
