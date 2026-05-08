<template>
  <div class="container mx-auto p-6 max-w-5xl">
    <h1 class="text-3xl font-bold mb-8">Company Profile</h1>

    <div v-if="store.loading && !store.profile" class="text-center py-10">Loading profile...</div>

    <form v-else @submit.prevent="handleSave" class="space-y-8">
      <!-- Branding Section -->
      <div class="bg-white rounded-xl shadow-sm border p-6">
        <h2 class="text-xl font-semibold mb-6 border-b pb-2">Branding</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <!-- Logo Upload -->
          <div class="flex flex-col items-center p-4 border-2 border-dashed rounded-lg">
            <img
              :src="logoPreview || store.profile?.logo_url || '/placeholder-logo.png'"
              class="w-32 h-32 object-contain mb-4 rounded bg-gray-50"
            />
            <label
              class="cursor-pointer bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100"
            >
              Change Logo
              <input type="file" @change="handleLogoUpload" class="hidden" accept="image/*" />
            </label>
          </div>

          <!-- Company Info -->
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Company Name</label>
              <input
                v-model="form.company_name"
                type="text"
                class="w-full border rounded-lg p-2.5 mt-1"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Website (URL)</label>
              <input
                v-model="form.website"
                type="url"
                class="w-full border rounded-lg p-2.5 mt-1"
                placeholder="https://..."
              />
            </div>
          </div>
        </div>
      </div>

      <!-- General Details -->
      <div class="bg-white rounded-xl shadow-sm border p-6">
        <h2 class="text-xl font-semibold mb-6 border-b pb-2">Company Details</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700">Industry</label>
            <input
              v-model="form.industry"
              type="text"
              class="w-full border rounded-lg p-2.5 mt-1"
              placeholder="e.g. Technology"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Company Size</label>
            <select v-model="form.company_size" class="w-full border rounded-lg p-2.5 mt-1">
              <option value="1-10">1-10 Employees</option>
              <option value="11-50">11-50 Employees</option>
              <option value="51-200">51-200 Employees</option>
              <option value="201-500">201-500 Employees</option>
              <option value="501+">501+ Employees</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Founded Year</label>
            <input
              v-model.number="form.founded_year"
              type="number"
              class="w-full border rounded-lg p-2.5 mt-1"
            />
          </div>
        </div>

        <div class="mt-6">
          <label class="block text-sm font-medium text-gray-700">About the Company</label>
          <textarea
            v-model="form.description"
            rows="5"
            class="w-full border rounded-lg p-2.5 mt-1"
            placeholder="Describe your company culture, mission..."
          ></textarea>
        </div>
      </div>

      <!-- Location -->
      <div class="bg-white rounded-xl shadow-sm border p-6">
        <h2 class="text-xl font-semibold mb-6 border-b pb-2">Headquarters</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700">City</label>
            <input v-model="form.city" type="text" class="w-full border rounded-lg p-2.5 mt-1" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Address</label>
            <input v-model="form.address" type="text" class="w-full border rounded-lg p-2.5 mt-1" />
          </div>
        </div>
      </div>

      <!-- Submit -->
      <div class="flex justify-end gap-4">
        <button type="button" class="px-6 py-2 text-gray-600 hover:underline">Cancel</button>
        <button
          :disabled="loading"
          type="submit"
          class="bg-blue-600 text-white px-10 py-3 rounded-xl font-bold shadow-lg hover:bg-blue-700 disabled:bg-gray-400"
        >
          {{ loading ? 'Saving Changes...' : 'Save Profile' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { useEmployerStore } from '@/stores/employer.store'

const store = useEmployerStore()
const loading = ref(false)
const logoPreview = ref(null)

const form = reactive({
  company_name: '',
  industry: '',
  company_size: '',
  founded_year: null,
  website: '',
  description: '',
  city: '',
  address: '',
  logo_file: null, // For multipart upload
})

onMounted(async () => {
  await store.fetchProfile()
  if (store.profile) {
    Object.assign(form, {
      company_name: store.profile.company_name,
      industry: store.profile.industry,
      company_size: store.profile.company_size,
      founded_year: store.profile.founded_year,
      website: store.profile.website,
      description: store.profile.description,
      city: store.profile.city,
      address: store.profile.address,
    })
  }
})

const handleLogoUpload = (e) => {
  const file = e.target.files[0]
  if (file) {
    form.logo_file = file
    logoPreview.value = URL.createObjectURL(file)
  }
}

const handleSave = async () => {
  loading.value = true
  try {
    await store.updateProfile({ ...form })
    alert('Profile updated successfully!')
  } catch (err) {
    console.error(err)
    alert('Error updating profile. Please check your data.')
  } finally {
    loading.value = false
  }
}
</script>
