<template>
  <div class="max-w-4xl mx-auto space-y-8 animate-fadeIn pb-20 px-4 md:px-0">
    <!-- Header Section (Optional but recommended) -->
    <div class="space-y-2 mb-10">
      <h2 class="text-3xl font-black text-slate-800 dark:text-white">Brand Profile</h2>
      <p class="text-slate-500 dark:text-slate-400 font-medium">
        Manage your company's public identity and presence.
      </p>
    </div>

    <form @submit.prevent="handleSave" class="space-y-6">
      <!-- Identity Card -->
      <div
        class="bg-white dark:bg-slate-900 p-6 md:p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none transition-all duration-300"
      >
        <div class="flex items-center gap-3 mb-8">
          <span class="w-2 h-6 bg-indigo-600 rounded-full"></span>
          <h3
            class="text-sm font-black uppercase text-slate-800 dark:text-slate-200 tracking-widest"
          >
            Brand Identity
          </h3>
        </div>

        <div class="flex flex-col md:flex-row items-center md:items-start gap-12">
          <!-- Logo Section -->
          <div class="relative group">
            <div
              class="w-40 h-40 rounded-[3rem] overflow-hidden bg-slate-50 dark:bg-slate-800 border-[6px] border-white dark:border-slate-700 shadow-2xl transition-transform duration-500 group-hover:scale-105"
            >
              <img
                :src="logoPreview || form.logo_url || '/placeholder-logo.png'"
                class="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-80"
              />
              <!-- Overlay on hover -->
              <div
                class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/10 pointer-events-none"
              >
                <i class="pi pi-pencil text-white text-xl"></i>
              </div>
            </div>

            <label
              class="absolute -bottom-2 -right-2 w-12 h-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl flex items-center justify-center cursor-pointer shadow-xl transition-all duration-300 hover:rotate-12"
            >
              <i class="pi pi-camera text-lg"></i>
              <input type="file" @change="handleLogoUpload" class="hidden" accept="image/*" />
            </label>

            <!-- Error for Logo -->
            <transition name="fade">
              <p
                v-if="errors.logo_file"
                class="absolute -bottom-10 left-0 right-0 text-[11px] text-rose-500 font-bold text-center"
              >
                {{ errors.logo_file }}
              </p>
            </transition>
          </div>

          <!-- Basic Info Fields -->
          <div class="flex-1 w-full space-y-6">
            <div class="space-y-2">
              <label class="text-[11px] font-black uppercase text-slate-400 ml-2 tracking-wider"
                >Company Name</label
              >
              <input
                v-model="form.company_name"
                type="text"
                placeholder="e.g. Acme Corp"
                :class="
                  errors.company_name
                    ? 'ring-2 ring-rose-500/50 border-rose-500'
                    : 'focus:ring-2 focus:ring-indigo-600/20 border-transparent'
                "
                class="w-full bg-slate-50 dark:bg-slate-800/50 border dark:border-slate-700 rounded-2xl px-6 py-4 text-sm font-bold text-slate-700 dark:text-slate-200 transition-all outline-none"
              />
              <p v-if="errors.company_name" class="text-[10px] text-rose-500 font-bold ml-2">
                {{ errors.company_name }}
              </p>
            </div>

            <div class="space-y-2">
              <label class="text-[11px] font-black uppercase text-slate-400 ml-2 tracking-wider"
                >Official Website</label
              >
              <div class="relative">
                <span class="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400"
                  ><i class="pi pi-link text-xs"></i
                ></span>
                <input
                  v-model="form.website"
                  type="text"
                  placeholder="https://example.com"
                  :class="
                    errors.website
                      ? 'ring-2 ring-rose-500/50 border-rose-500'
                      : 'focus:ring-2 focus:ring-indigo-600/20 border-transparent'
                  "
                  class="w-full bg-slate-50 dark:bg-slate-800/50 border dark:border-slate-700 rounded-2xl pl-12 pr-6 py-4 text-sm font-bold text-slate-700 dark:text-slate-200 transition-all outline-none"
                />
              </div>
              <p v-if="errors.website" class="text-[10px] text-rose-500 font-bold ml-2">
                {{ errors.website }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- General Details Card -->
      <div
        class="bg-white dark:bg-slate-900 p-6 md:p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none grid grid-cols-1 md:grid-cols-2 gap-8"
      >
        <div class="space-y-2">
          <label class="text-[11px] font-black uppercase text-slate-400 ml-2 tracking-wider"
            >Industry Sector</label
          >
          <input
            v-model="form.industry"
            type="text"
            placeholder="e.g. Technology"
            :class="
              errors.industry
                ? 'ring-2 ring-rose-500/50 border-rose-500'
                : 'focus:ring-2 focus:ring-indigo-600/20 border-transparent'
            "
            class="w-full bg-slate-50 dark:bg-slate-800/50 border dark:border-slate-700 rounded-2xl px-6 py-4 text-sm font-bold text-slate-700 dark:text-slate-200 transition-all outline-none"
          />
          <p v-if="errors.industry" class="text-[10px] text-rose-500 font-bold ml-2">
            {{ errors.industry }}
          </p>
        </div>

        <div class="space-y-2">
          <label class="text-[11px] font-black uppercase text-slate-400 ml-2 tracking-wider"
            >Company Size</label
          >
          <div class="relative">
            <select
              v-model="form.company_size"
              class="w-full bg-slate-50 dark:bg-slate-800/50 border border-transparent dark:border-slate-700 rounded-2xl px-6 py-4 text-sm font-bold text-slate-700 dark:text-slate-200 appearance-none focus:ring-2 focus:ring-indigo-600/20 outline-none cursor-pointer"
            >
              <option value="">Select Size</option>
              <option value="1-10">1-10 Employees</option>
              <option value="11-50">11-50 Employees</option>
              <option value="51-200">51-200 Employees</option>
              <option value="201-500">201-500 Employees</option>
            </select>
            <i
              class="pi pi-chevron-down absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-xs"
            ></i>
          </div>
          <p v-if="errors.company_size" class="text-[10px] text-rose-500 font-bold ml-2">
            {{ errors.company_size }}
          </p>
        </div>

        <div class="md:col-span-2 space-y-2">
          <label class="text-[11px] font-black uppercase text-slate-400 ml-2 tracking-wider"
            >About Company</label
          >
          <textarea
            v-model="form.description"
            rows="5"
            placeholder="Tell us about your company vision and culture..."
            :class="
              errors.description
                ? 'ring-2 ring-rose-500/50 border-rose-500'
                : 'focus:ring-2 focus:ring-indigo-600/20 border-transparent'
            "
            class="w-full bg-slate-50 dark:bg-slate-800/50 border dark:border-slate-700 rounded-[2rem] px-6 py-4 text-sm font-bold text-slate-700 dark:text-slate-200 transition-all outline-none resize-none"
          ></textarea>
          <p v-if="errors.description" class="text-[10px] text-rose-500 font-bold ml-2">
            {{ errors.description }}
          </p>
        </div>
      </div>

      <!-- Action Button -->
      <div class="pt-4">
        <button
          :disabled="loading"
          type="submit"
          class="w-full relative overflow-hidden group bg-indigo-600 disabled:bg-slate-400 text-white rounded-2xl py-5 text-sm font-black uppercase tracking-[0.2em] transition-all duration-300 hover:bg-indigo-700 hover:shadow-2xl hover:shadow-indigo-500/40 active:scale-[0.98]"
        >
          <span class="relative z-10 flex items-center justify-center gap-2">
            <i v-if="loading" class="pi pi-spin pi-spinner"></i>
            {{ loading ? 'Saving Changes...' : 'Update Brand Profile' }}
          </span>
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.animate-fadeIn {
  animation: fadeIn 0.6s ease-out;
}

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

/* Custom Scrollbar for Textarea if needed */
textarea::-webkit-scrollbar {
  width: 6px;
}
textarea::-webkit-scrollbar-thumb {
  background-color: #e2e8f0;
  border-radius: 10px;
}
</style>
<script setup>
import { ref, onMounted, reactive, watch } from 'vue'
import { useEmployerStore } from '@/stores/EmployerStore'

const store = useEmployerStore()
const loading = ref(false)
const logoPreview = ref(null)
const errors = reactive({})

const form = reactive({
  company_name: '',
  industry: '',
  company_size: '',
  website: '',
  description: '',
  logo_url: null,
  logo_file: null,
})

const validateForm = () => {
  Object.keys(errors).forEach((key) => delete errors[key])

  if (!form.company_name || form.company_name.length < 3) {
    errors.company_name = 'Company name must be at least 3 characters.'
  }

  if (
    form.website &&
    !/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(form.website)
  ) {
    errors.website = 'Please enter a valid URL (e.g., https://google.com).'
  }

  if (!form.industry) {
    errors.industry = 'Industry is required.'
  }

  if (!form.company_size) {
    errors.company_size = 'Please select your company size.'
  }

  if (form.description && form.description.length < 20) {
    errors.description = 'About section should be at least 20 characters.'
  }

  if (form.logo_file && form.logo_file.size > 2 * 1024 * 1024) {
    errors.logo_file = 'Image must be less than 2MB.'
  }

  return Object.keys(errors).length === 0
}

const handleSave = async () => {
  if (!validateForm()) return

  loading.value = true
  try {
    const formData = new FormData()
    Object.keys(form).forEach((key) => {
      if (form[key] !== null && key !== 'logo_url') {
        formData.append(key, form[key])
      }
    })

    await store.updateProfile(formData)
  } catch (err) {
    if (err.response?.data?.errors) {
      Object.assign(errors, err.response.data.errors)
    } else {
    }
  } finally {
    loading.value = false
  }
}

const handleLogoUpload = (e) => {
  const file = e.target.files[0]
  if (file) {
    form.logo_file = file
    logoPreview.value = URL.createObjectURL(file)
  }
}

watch(
  () => store.profile,
  (newProfile) => {
    if (newProfile) {
      Object.assign(form, {
        company_name: newProfile.company_name || '',
        industry: newProfile.industry || '',
        company_size: newProfile.company_size || '',
        website: newProfile.website || '',
        description: newProfile.description || '',
        logo_url: newProfile.logo_url || null,
      })
    }
  },
  { immediate: true },
)

onMounted(() => store.fetchProfile())
</script>
