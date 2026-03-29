<script setup>
import { computed, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAdminStore } from '@/stores/admin.store'
import { useAuthStore } from '@/stores/auth.store'
import Swal from 'sweetalert2'

const route = useRoute()
const router = useRouter()
const adminStore = useAdminStore()
const authStore = useAuthStore()
const userId = route.params.id
const actionLoading = ref(false)

onMounted(async () => {
  await adminStore.fetchAllData()
})

const user = computed(() => adminStore.users.find((u) => u.id == userId) || {})

const canToggleStatus = computed(() => {
  return user.value.role !== 'admin' && String(user.value.id) !== String(authStore.user?.id)
})

const profileData = computed(() => {
  if (user.value.role === 'employer') {
    return adminStore.employers.find((e) => e.user_id == userId) || {}
  } else if (user.value.role === 'candidate') {
    return adminStore.candidates?.find((c) => c.user_id == userId) || {}
  }
  return {}
})

const userJobs = computed(() => {
  if (user.value.role === 'employer') {
    return adminStore.jobs.filter((j) => j.employer_id == profileData.value.id)
  }
  return []
})

const userApplications = computed(() => {
  if (user.value.role === 'candidate') {
    return adminStore.applications.filter((app) => app.candidate_id == profileData.value.id)
  }
  return []
})

const getJobTitle = (jobId) => {
  const job = adminStore.jobs.find((j) => j.id == jobId)
  return job ? job.title : 'Unknown Job'
}

const toggleStatus = async () => {
  if (!canToggleStatus.value) return

  const action = user.value.is_active ? 'suspend' : 'activate'
  const result = await Swal.fire({
    title: `${action.charAt(0).toUpperCase() + action.slice(1)} this account?`,
    text: `Are you sure you want to ${action} ${user.value.name || 'this user'}?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: user.value.is_active ? '#dc2626' : '#059669',
    confirmButtonText: `Yes, ${action}`,
  })
  if (!result.isConfirmed) return

  actionLoading.value = true
  try {
    await adminStore.updateUserStatus(user.value.id, !user.value.is_active)
    Swal.fire({
      title: 'Updated!',
      text: `Account has been ${action}d.`,
      icon: 'success',
      timer: 1500,
      showConfirmButton: false,
    })
  } catch (err) {
    Swal.fire('Error', 'Failed to update status.', 'error')
  } finally {
    actionLoading.value = false
  }
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}
</script>

<template>
  <div class="p-10 max-w-[1800px] mx-auto">
    <!-- Breadcrumbs / Back -->
    <button
      @click="router.back()"
      class="flex items-center gap-2 text-gray-400 hover:text-indigo-600 font-bold text-sm mb-8 transition-colors group"
    >
      <i class="pi pi-arrow-left group-hover:-translate-x-1 transition-transform"></i>
      Back to Users
    </button>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-10">
      <!-- Sidebar: User Profile Card -->
      <div class="space-y-8">
        <div class="bg-white border border-gray-100 p-10 rounded-[3rem] shadow-sm text-center">
          <div class="relative inline-block mb-6">
            <div
              class="w-32 h-32 bg-gray-50 rounded-[2.5rem] overflow-hidden border-4 border-white shadow-xl mx-auto"
            >
              <img
                :src="user.avatar || 'https://i.pravatar.cc/150?img=1'"
                alt=""
                class="w-full h-full object-cover"
              />
            </div>
            <div
              :class="[
                'absolute bottom-2 right-2 w-6 h-6 border-4 border-white rounded-full shadow-sm',
                user.is_active ? 'bg-emerald-500' : 'bg-red-500',
              ]"
            ></div>
          </div>

          <h1 class="text-2xl font-black text-slate-900 tracking-tight leading-tight">
            {{ user.name || 'Unnamed User' }}
          </h1>
          <p class="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mt-2 mb-6">
            {{ user.role }} Account
          </p>

          <div class="flex flex-col gap-3">
            <button
              v-if="canToggleStatus"
              @click="toggleStatus"
              :disabled="actionLoading"
              :class="[
                'w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg',
                actionLoading ? 'opacity-50 cursor-not-allowed' : '',
                user.is_active
                  ? 'bg-red-50 text-red-600 shadow-red-50'
                  : 'bg-emerald-50 text-emerald-600 shadow-emerald-50',
              ]"
            >
              <i v-if="actionLoading" class="pi pi-spin pi-spinner mr-1"></i>
              {{ user.is_active ? 'Suspend Account' : 'Activate Account' }}
            </button>
            <span
              v-else
              class="w-full py-4 bg-gray-50 text-gray-400 rounded-2xl font-black text-xs uppercase tracking-widest text-center"
            >
              Protected Account
            </span>
            <a
              :href="`mailto:${user.email}`"
              class="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all flex items-center justify-center gap-2"
            >
              <i class="pi pi-envelope"></i>
              Send Email
            </a>
          </div>
        </div>

        <!-- System Stats -->
        <div class="bg-slate-900 p-8 rounded-[3rem] text-white relative overflow-hidden">
          <div
            class="absolute -right-4 -bottom-4 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl"
          ></div>
          <h3 class="font-black italic text-lg mb-6 relative z-10">
            Account History<span class="text-indigo-400">.</span>
          </h3>
          <div class="space-y-4 relative z-10">
            <div>
              <p class="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">
                Member Since
              </p>
              <p class="font-bold text-sm">{{ formatDate(user.created_at) }}</p>
            </div>
            <div>
              <p class="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">
                Last Updated
              </p>
              <p class="font-bold text-sm">{{ formatDate(user.updated_at) }}</p>
            </div>
            <div>
              <p class="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">
                Email Verified
              </p>
              <p class="font-bold text-sm text-emerald-400">
                {{ user.email_verified_at ? formatDate(user.email_verified_at) : 'Not Verified' }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content: Profile Details -->
      <div class="lg:col-span-2 space-y-10">
        <!-- Profile Info -->
        <div class="bg-white border border-gray-100 p-10 rounded-[3rem] shadow-sm">
          <div class="flex items-center gap-2 mb-8">
            <span class="w-2 h-4 bg-indigo-600 rounded-full"></span>
            <h2 class="text-xl font-black text-slate-900 italic">
              Profile Information<span class="text-indigo-600">.</span>
            </h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                Full Identity
              </p>
              <p class="font-bold text-slate-900">{{ user.name || 'N/A' }}</p>
            </div>
            <div>
              <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                Communication
              </p>
              <p class="font-bold text-slate-900">{{ user.email || 'N/A' }}</p>
            </div>
            <div>
              <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                Phone Reference
              </p>
              <p class="font-bold text-slate-900">{{ user.phone || 'N/A' }}</p>
            </div>
            <div v-if="user.role === 'employer'">
              <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                Organization
              </p>
              <p class="font-bold text-indigo-600">{{ profileData.company_name || 'N/A' }}</p>
            </div>
            <div v-if="user.role === 'candidate'">
              <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                Professional Title
              </p>
              <p class="font-bold text-indigo-600">{{ profileData.headline || profileData.title || 'N/A' }}</p>
            </div>
          </div>

          <div v-if="profileData.description" class="mt-8 pt-8 border-t border-gray-50">
            <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
              Description / Bio
            </p>
            <p class="text-gray-500 font-medium leading-relaxed">{{ profileData.description }}</p>
          </div>
        </div>

        <!-- Role Specific Activity -->

        <!-- Case: Employer (Jobs Posted) -->
        <div
          v-if="user.role === 'employer'"
          class="bg-white border border-gray-100 rounded-[3rem] shadow-sm overflow-hidden"
        >
          <div class="p-8 border-b border-gray-50 bg-gray-50/30">
            <h3 class="font-black text-slate-900 italic text-xl">
              Posted Jobs ({{ userJobs.length }})<span class="text-indigo-600">.</span>
            </h3>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-left">
              <thead>
                <tr class="bg-gray-50/50">
                  <th
                    class="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest"
                  >
                    Job Posting
                  </th>
                  <th
                    class="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest"
                  >
                    Status
                  </th>
                  <th
                    class="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right"
                  >
                    Activity
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-50">
                <tr
                  v-for="job in userJobs"
                  :key="job.id"
                  class="hover:bg-gray-50/50 transition-all group"
                >
                  <td class="px-8 py-6">
                    <router-link
                      :to="`/admin/management/jobs/${job.id}`"
                      class="font-bold text-slate-900 hover:text-indigo-600 transition-colors"
                    >
                      {{ job.title }}
                    </router-link>
                    <p class="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1">
                      {{ job.location }}
                    </p>
                  </td>
                  <td class="px-8 py-6">
                    <span
                      :class="[
                        job.status === 'active'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-gray-100 text-gray-700',
                        'text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full',
                      ]"
                    >
                      {{ job.status }}
                    </span>
                  </td>
                  <td class="px-8 py-6 text-right">
                    <span class="text-xs font-black text-indigo-600"
                      >{{ job.applications_count }} Apps</span
                    >
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-if="userJobs.length === 0" class="p-16 text-center">
            <p class="text-gray-300 font-black italic">
              This employer has not posted any jobs yet.
            </p>
          </div>
        </div>

        <!-- Case: Candidate (Applications) -->
        <div
          v-if="user.role === 'candidate'"
          class="bg-white border border-gray-100 rounded-[3rem] shadow-sm overflow-hidden"
        >
          <div class="p-8 border-b border-gray-50 bg-gray-50/30">
            <h3 class="font-black text-slate-900 italic text-xl">
              Recent Applications ({{ userApplications.length }})<span class="text-indigo-600"
                >.</span
              >
            </h3>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-left">
              <thead>
                <tr class="bg-gray-50/50">
                  <th
                    class="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest"
                  >
                    Position
                  </th>
                  <th
                    class="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest"
                  >
                    Status
                  </th>
                  <th
                    class="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right"
                  >
                    Date
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-50">
                <tr
                  v-for="app in userApplications"
                  :key="app.id"
                  class="hover:bg-gray-50/50 transition-all group"
                >
                  <td class="px-8 py-6">
                    <router-link
                      :to="`/admin/management/jobs/${app.job_id}`"
                      class="font-bold text-slate-900 hover:text-indigo-600 transition-colors"
                    >
                      {{ getJobTitle(app.job_id) }}
                    </router-link>
                  </td>
                  <td class="px-8 py-6">
                    <span
                      class="text-[10px] font-black uppercase bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full"
                    >
                      {{ app.status }}
                    </span>
                  </td>
                  <td class="px-8 py-6 text-right text-xs font-bold text-gray-400">
                    {{ formatDate(app.created_at) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-if="userApplications.length === 0" class="p-16 text-center">
            <p class="text-gray-300 font-black italic">
              This candidate has not applied for any jobs yet.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
