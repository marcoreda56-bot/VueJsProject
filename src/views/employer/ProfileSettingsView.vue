<script setup>
import { ref, onMounted } from 'vue'
import { useEmployerStore } from '@/stores/EmployerStore'

const employerStore = useEmployerStore()
const form = ref({
  company_name: '',
  website: '',
  location: '',
  bio: '',
  logo_url: '',
})

onMounted(async () => {
  await employerStore.fetchProfile()
  if (employerStore.profile) {
    form.value = { ...employerStore.profile }
  }
})

const handleUpdate = async () => {
  try {
    await employerStore.updateProfile(form.value)
    alert('Profile updated successfully!')
  } catch (err) {
    alert('Update failed, please try again.')
  }
}
</script>

<template>
  <div class="min-h-screen bg-[#FAFAFA] dark:bg-slate-950 font-['Outfit'] p-6 md:p-12">
    <div class="max-w-4xl mx-auto">
      <header class="mb-12 animate-[fadeIn_0.5s_ease-out]">
        <h1 class="text-5xl font-black text-slate-900 dark:text-white tracking-tighter italic mb-2">
          Company <span class="text-indigo-600">Identity.</span>
        </h1>
        <p class="text-slate-400 font-medium">How the world sees your organization.</p>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <aside class="space-y-6">
          <div
            class="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl shadow-indigo-500/5 text-center"
          >
            <div
              class="w-32 h-32 bg-slate-50 dark:bg-slate-800 rounded-[2rem] mx-auto mb-6 overflow-hidden border border-slate-100 dark:border-slate-700 flex items-center justify-center"
            >
              <img
                :src="
                  form.logo_url ||
                  `https://ui-avatars.com/api/?name=${form.company_name}&background=6366f1&color=fff`
                "
                class="w-full h-full object-cover"
              />
            </div>
            <h4 class="font-black text-slate-900 dark:text-white mb-1">
              {{ form.company_name || 'Your Company' }}
            </h4>
            <p class="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Public Preview
            </p>
          </div>

          <div
            class="p-6 bg-indigo-600 rounded-[2rem] text-white text-xs font-bold leading-relaxed shadow-xl shadow-indigo-600/20"
          >
            <i class="pi pi-info-circle mr-2"></i>
            A professional logo and clear bio increase candidate trust by up to 80%.
          </div>
        </aside>

        <main class="lg:col-span-2">
          <form @submit.prevent="handleUpdate" class="space-y-8">
            <div
              class="bg-white dark:bg-slate-900 p-10 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-2xl shadow-indigo-500/5 space-y-8"
            >
              <div class="space-y-2">
                <label class="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4"
                  >Company Name</label
                >
                <input
                  v-model="form.company_name"
                  type="text"
                  class="w-full px-8 py-5 bg-slate-50 dark:bg-slate-800 border-none rounded-[1.5rem] focus:ring-2 focus:ring-indigo-500 font-bold text-slate-900 dark:text-white transition-all"
                />
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div class="space-y-2">
                  <label
                    class="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4"
                    >Website URL</label
                  >
                  <input
                    v-model="form.website"
                    type="url"
                    placeholder="https://..."
                    class="w-full px-8 py-5 bg-slate-50 dark:bg-slate-800 border-none rounded-[1.5rem] focus:ring-2 focus:ring-indigo-500 font-bold text-slate-900 dark:text-white transition-all"
                  />
                </div>
                <div class="space-y-2">
                  <label
                    class="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4"
                    >HQ Location</label
                  >
                  <input
                    v-model="form.location"
                    type="text"
                    placeholder="Cairo, Egypt"
                    class="w-full px-8 py-5 bg-slate-50 dark:bg-slate-800 border-none rounded-[1.5rem] focus:ring-2 focus:ring-indigo-500 font-bold text-slate-900 dark:text-white transition-all"
                  />
                </div>
              </div>

              <div class="space-y-2">
                <label class="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4"
                  >Logo Image URL</label
                >
                <input
                  v-model="form.logo_url"
                  type="text"
                  placeholder="https://image-link.com/logo.png"
                  class="w-full px-8 py-5 bg-slate-50 dark:bg-slate-800 border-none rounded-[1.5rem] focus:ring-2 focus:ring-indigo-500 font-bold text-slate-900 dark:text-white transition-all"
                />
              </div>

              <div class="space-y-2">
                <label class="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4"
                  >About the Company</label
                >
                <textarea
                  v-model="form.bio"
                  rows="6"
                  class="w-full px-8 py-6 bg-slate-50 dark:bg-slate-800 border-none rounded-[2rem] focus:ring-2 focus:ring-indigo-500 font-medium text-slate-600 dark:text-white leading-relaxed"
                ></textarea>
              </div>

              <div class="flex justify-end pt-4">
                <button
                  type="submit"
                  :disabled="employerStore.loading"
                  class="px-12 py-5 bg-slate-900 dark:bg-indigo-600 hover:bg-indigo-500 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl transition-all active:scale-95"
                >
                  {{ employerStore.loading ? 'Updating...' : 'Save Changes' }}
                </button>
              </div>
            </div>
          </form>
        </main>
      </div>
    </div>
  </div>
</template>
