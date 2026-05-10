<template>
  <div class="max-w-6xl mx-auto space-y-8 animate-fadeIn pb-20 px-4 md:px-0">
    <!-- Header -->
    <div class="space-y-2 mb-6">
      <h2 class="text-3xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">
        Company <span class="text-indigo-600">Profile.</span>
      </h2>
      <p class="text-slate-500 dark:text-slate-400 font-medium text-sm">
        Manage your company's public identity and presence.
      </p>
    </div>

    <form @submit.prevent="handleSave" class="space-y-6">
      <!-- Hero / Cover Section -->
      <div class="relative rounded-[2.5rem] overflow-hidden border border-slate-100 dark:border-slate-800 shadow-xl">
        <!-- Cover Image -->
        <div class="relative h-48 md:h-64 bg-slate-100 dark:bg-slate-800">
          <img
            v-if="coverPreview || form.cover_image_url"
            :src="coverPreview || form.cover_image_url"
            class="w-full h-full object-cover"
          />
          <div v-else class="w-full h-full flex items-center justify-center bg-slate-50 dark:bg-slate-800">
            <i class="pi pi-image text-4xl text-slate-300"></i>
          </div>
          <!-- Cover Upload Overlay -->
          <label class="absolute bottom-4 right-4 w-12 h-12 bg-white/90 dark:bg-slate-900/90 backdrop-blur hover:bg-indigo-600 hover:text-white text-slate-600 rounded-2xl flex items-center justify-center cursor-pointer shadow-lg transition-all duration-300 hover:rotate-12">
            <i class="pi pi-camera text-lg"></i>
            <input type="file" @change="handleCoverUpload" class="hidden" accept="image/*" />
          </label>
        </div>

        <!-- Logo & Quick Stats Overlay -->
        <div class="relative px-6 md:px-10 pb-8 -mt-16 flex flex-col md:flex-row items-end gap-6">
          <!-- Logo -->
          <div class="relative group flex-shrink-0">
            <div class="w-32 h-32 rounded-[2rem] overflow-hidden bg-white dark:bg-slate-900 border-[5px] border-white dark:border-slate-800 shadow-2xl">
              <img
                :src="logoPreview || form.logo_url || '/placeholder-logo.png'"
                class="w-full h-full object-cover"
              />
            </div>
            <label class="absolute -bottom-2 -right-2 w-10 h-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl flex items-center justify-center cursor-pointer shadow-lg transition-all hover:rotate-12">
              <i class="pi pi-camera text-sm"></i>
              <input type="file" @change="handleLogoUpload" class="hidden" accept="image/*" />
            </label>
          </div>

          <!-- Company Quick Info -->
          <div class="flex-1 pb-2">
            <div class="flex items-center gap-3 mb-1">
              <h3 class="text-2xl font-black text-slate-900 dark:text-white">{{ form.company_name || 'Your Company' }}</h3>
              <span v-if="form.is_verified" class="bg-emerald-100 text-emerald-700 text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-widest">
                <i class="pi pi-verified mr-1"></i> Verified
              </span>
            </div>
            <div class="flex flex-wrap gap-3 text-sm text-slate-500 dark:text-slate-400 font-medium">
              <span v-if="form.industry"><i class="pi pi-briefcase mr-1"></i> {{ form.industry }}</span>
              <span v-if="form.company_size"><i class="pi pi-users mr-1"></i> {{ form.company_size }}</span>
              <span v-if="form.city || form.country">
                <i class="pi pi-map-marker mr-1"></i> {{ [form.city, form.country].filter(Boolean).join(', ') }}
              </span>
            </div>
          </div>

          <!-- Rating Badge -->
          <div v-if="form.average_rating > 0" class="flex items-center gap-1 bg-amber-50 dark:bg-amber-900/20 px-4 py-2 rounded-2xl border border-amber-100 dark:border-amber-900/30">
            <i class="pi pi-star-fill text-amber-500"></i>
            <span class="font-black text-amber-700 dark:text-amber-400 text-lg">{{ form.average_rating }}</span>
            <span class="text-xs text-amber-600 dark:text-amber-500 font-bold">({{ form.total_reviews }} reviews)</span>
          </div>
        </div>
      </div>

      <!-- Identity Card -->
      <div class="bg-white dark:bg-slate-900 p-6 md:p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none">
        <div class="flex items-center gap-3 mb-8">
          <span class="w-2 h-6 bg-indigo-600 rounded-full"></span>
          <h3 class="text-sm font-black uppercase text-slate-800 dark:text-slate-200 tracking-widest">Brand Identity</h3>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-2">
            <label class="text-[11px] font-black uppercase text-slate-400 ml-2 tracking-wider">Company Name <span class="text-rose-500">*</span></label>
            <input v-model="form.company_name" type="text" maxlength="150"
              :class="errors.company_name ? 'ring-2 ring-rose-500/50 border-rose-500' : 'focus:ring-2 focus:ring-indigo-600/20 border-transparent'"
              class="w-full bg-slate-50 dark:bg-slate-800/50 border dark:border-slate-700 rounded-2xl px-6 py-4 text-sm font-bold text-slate-700 dark:text-slate-200 transition-all outline-none" />
            <p v-if="errors.company_name" class="text-[10px] text-rose-500 font-bold ml-2">{{ errors.company_name }}</p>
          </div>

          <div class="space-y-2">
            <label class="text-[11px] font-black uppercase text-slate-400 ml-2 tracking-wider">Industry Sector</label>
            <input v-model="form.industry" type="text" maxlength="100"
              :class="errors.industry ? 'ring-2 ring-rose-500/50 border-rose-500' : 'focus:ring-2 focus:ring-indigo-600/20 border-transparent'"
              class="w-full bg-slate-50 dark:bg-slate-800/50 border dark:border-slate-700 rounded-2xl px-6 py-4 text-sm font-bold text-slate-700 dark:text-slate-200 transition-all outline-none" />
          </div>

          <div class="space-y-2">
            <label class="text-[11px] font-black uppercase text-slate-400 ml-2 tracking-wider">Company Size</label>
            <div class="relative">
              <select v-model="form.company_size"
                class="w-full bg-slate-50 dark:bg-slate-800/50 border border-transparent dark:border-slate-700 rounded-2xl px-6 py-4 text-sm font-bold text-slate-700 dark:text-slate-200 appearance-none focus:ring-2 focus:ring-indigo-600/20 outline-none cursor-pointer">
                <option value="">Select Size</option>
                <option value="1-10">1-10 Employees</option>
                <option value="11-50">11-50 Employees</option>
                <option value="51-200">51-200 Employees</option>
                <option value="201-500">201-500 Employees</option>
                <option value="501-1000">501-1,000 Employees</option>
                <option value="1000+">1,000+ Employees</option>
              </select>
              <i class="pi pi-chevron-down absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-xs"></i>
            </div>
          </div>

          <div class="space-y-2">
            <label class="text-[11px] font-black uppercase text-slate-400 ml-2 tracking-wider">Founded Year</label>
            <input v-model.number="form.founded_year" type="number" :min="1800" :max="new Date().getFullYear()"
              class="w-full bg-slate-50 dark:bg-slate-800/50 border dark:border-slate-700 rounded-2xl px-6 py-4 text-sm font-bold text-slate-700 dark:text-slate-200 transition-all outline-none focus:ring-2 focus:ring-indigo-600/20" />
          </div>

          <div class="space-y-2 md:col-span-2">
            <label class="text-[11px] font-black uppercase text-slate-400 ml-2 tracking-wider">Official Website</label>
            <div class="relative">
              <span class="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400"><i class="pi pi-link text-xs"></i></span>
              <input v-model="form.website" type="text" maxlength="255" placeholder="https://example.com"
                :class="errors.website ? 'ring-2 ring-rose-500/50 border-rose-500' : 'focus:ring-2 focus:ring-indigo-600/20 border-transparent'"
                class="w-full bg-slate-50 dark:bg-slate-800/50 border dark:border-slate-700 rounded-2xl pl-12 pr-6 py-4 text-sm font-bold text-slate-700 dark:text-slate-200 transition-all outline-none" />
            </div>
            <p v-if="errors.website" class="text-[10px] text-rose-500 font-bold ml-2">{{ errors.website }}</p>
          </div>
        </div>
      </div>

      <!-- Location Card -->
      <div class="bg-white dark:bg-slate-900 p-6 md:p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none">
        <div class="flex items-center gap-3 mb-8">
          <span class="w-2 h-6 bg-emerald-500 rounded-full"></span>
          <h3 class="text-sm font-black uppercase text-slate-800 dark:text-slate-200 tracking-widest">Location & Headquarters</h3>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-2">
            <label class="text-[11px] font-black uppercase text-slate-400 ml-2 tracking-wider">Headquarters</label>
            <input v-model="form.headquarters" type="text" maxlength="255" placeholder="e.g. Cairo, Egypt"
              class="w-full bg-slate-50 dark:bg-slate-800/50 border dark:border-slate-700 rounded-2xl px-6 py-4 text-sm font-bold text-slate-700 dark:text-slate-200 transition-all outline-none focus:ring-2 focus:ring-indigo-600/20" />
          </div>
          <div class="space-y-2">
            <label class="text-[11px] font-black uppercase text-slate-400 ml-2 tracking-wider">Address</label>
            <input v-model="form.address" type="text" maxlength="255" placeholder="Full street address"
              class="w-full bg-slate-50 dark:bg-slate-800/50 border dark:border-slate-700 rounded-2xl px-6 py-4 text-sm font-bold text-slate-700 dark:text-slate-200 transition-all outline-none focus:ring-2 focus:ring-indigo-600/20" />
          </div>
          <div class="space-y-2">
            <label class="text-[11px] font-black uppercase text-slate-400 ml-2 tracking-wider">City</label>
            <input v-model="form.city" type="text" maxlength="100" placeholder="e.g. Cairo"
              class="w-full bg-slate-50 dark:bg-slate-800/50 border dark:border-slate-700 rounded-2xl px-6 py-4 text-sm font-bold text-slate-700 dark:text-slate-200 transition-all outline-none focus:ring-2 focus:ring-indigo-600/20" />
          </div>
          <div class="space-y-2">
            <label class="text-[11px] font-black uppercase text-slate-400 ml-2 tracking-wider">Country (2-letter code)</label>
            <input v-model="form.country" type="text" maxlength="2" placeholder="e.g. EG"
              class="w-full bg-slate-50 dark:bg-slate-800/50 border dark:border-slate-700 rounded-2xl px-6 py-4 text-sm font-bold text-slate-700 dark:text-slate-200 transition-all outline-none focus:ring-2 focus:ring-indigo-600/20 uppercase" />
          </div>
        </div>
      </div>

      <!-- About Card -->
      <div class="bg-white dark:bg-slate-900 p-6 md:p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none">
        <div class="flex items-center gap-3 mb-8">
          <span class="w-2 h-6 bg-amber-500 rounded-full"></span>
          <h3 class="text-sm font-black uppercase text-slate-800 dark:text-slate-200 tracking-widest">About Company</h3>
        </div>
        <div class="space-y-2">
          <textarea v-model="form.description" rows="6" placeholder="Tell us about your company vision, culture, and what makes you unique..."
            :class="errors.description ? 'ring-2 ring-rose-500/50 border-rose-500' : 'focus:ring-2 focus:ring-indigo-600/20 border-transparent'"
            class="w-full bg-slate-50 dark:bg-slate-800/50 border dark:border-slate-700 rounded-[2rem] px-6 py-4 text-sm font-bold text-slate-700 dark:text-slate-200 transition-all outline-none resize-none"></textarea>
          <p v-if="errors.description" class="text-[10px] text-rose-500 font-bold ml-2">{{ errors.description }}</p>
        </div>
      </div>

      <!-- Action Button -->
      <div class="pt-4">
        <button :disabled="loading" type="submit"
          class="w-full relative overflow-hidden group bg-indigo-600 disabled:bg-slate-400 text-white rounded-2xl py-5 text-sm font-black uppercase tracking-[0.2em] transition-all duration-300 hover:bg-indigo-700 hover:shadow-2xl hover:shadow-indigo-500/40 active:scale-[0.98]">
          <span class="relative z-10 flex items-center justify-center gap-2">
            <i v-if="loading" class="pi pi-spin pi-spinner"></i>
            {{ loading ? 'Saving Changes...' : 'Update Company Profile' }}
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
import Swal from 'sweetalert2'

const store = useEmployerStore()
const loading = ref(false)
const logoPreview = ref(null)
const coverPreview = ref(null)
const errors = reactive({})

const form = reactive({
  company_name: '',
  industry: '',
  company_size: '',
  founded_year: null,
  website: '',
  description: '',
  headquarters: '',
  address: '',
  city: '',
  country: '',
  logo_url: null,
  logo: null,
  cover_image_url: null,
  cover_image: null,
  is_verified: false,
  average_rating: 0,
  total_reviews: 0,
})

const validateForm = () => {
  Object.keys(errors).forEach((key) => delete errors[key])

  if (!form.company_name || form.company_name.length < 3) {
    errors.company_name = 'Company name must be at least 3 characters.'
  }

  if (form.website && !/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(form.website)) {
    errors.website = 'Please enter a valid URL (e.g., https://google.com).'
  }

  if (form.logo && form.logo instanceof File && form.logo.size > 2 * 1024 * 1024) {
    errors.logo = 'Logo image must be less than 2MB.'
  }

  if (form.cover_image && form.cover_image instanceof File && form.cover_image.size > 5 * 1024 * 1024) {
    errors.cover_image = 'Cover image must be less than 5MB.'
  }

  return Object.keys(errors).length === 0
}

const handleSave = async () => {
  if (!validateForm()) return

  loading.value = true
  try {
    const payload = { ...form }
    if (payload.logo_url) delete payload.logo_url
    if (payload.cover_image_url) delete payload.cover_image_url
    if (payload.is_verified) delete payload.is_verified
    if (payload.average_rating) delete payload.average_rating
    if (payload.total_reviews) delete payload.total_reviews

    await store.updateProfile(payload)
    logoPreview.value = null
    coverPreview.value = null
    Swal.fire({ icon: 'success', title: 'Profile Updated', timer: 2000, showConfirmButton: false })
  } catch (err) {
    if (err.response?.data?.errors) {
      Object.assign(errors, err.response.data.errors)
    }
    Swal.fire({ icon: 'error', title: 'Update Failed', text: err.response?.data?.message || 'Please check your inputs.', confirmButtonColor: '#6366f1' })
  } finally {
    loading.value = false
  }
}

const handleLogoUpload = (e) => {
  const file = e.target.files[0]
  if (file) {
    form.logo = file
    logoPreview.value = URL.createObjectURL(file)
  }
}

const handleCoverUpload = (e) => {
  const file = e.target.files[0]
  if (file) {
    form.cover_image = file
    coverPreview.value = URL.createObjectURL(file)
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
        founded_year: newProfile.founded_year || null,
        website: newProfile.website || '',
        description: newProfile.description || '',
        headquarters: newProfile.headquarters || '',
        address: newProfile.address || '',
        city: newProfile.city || '',
        country: newProfile.country || '',
        logo_url: newProfile.logo_url || null,
        cover_image_url: newProfile.cover_image_url || null,
        logo: null,
        cover_image: null,
        is_verified: newProfile.is_verified || false,
        average_rating: newProfile.average_rating || 0,
        total_reviews: newProfile.total_reviews || 0,
      })
      logoPreview.value = null
      coverPreview.value = null
    }
  },
  { immediate: true },
)

onMounted(() => store.fetchProfile())
</script>
