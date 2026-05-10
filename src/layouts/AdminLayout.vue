<template>
  <div class="min-h-screen bg-[#FBFBFB] flex font-['Outfit',sans-serif]">
    <!-- Sidebar -->
    <aside
      :class="[
        'w-72 bg-white border-r border-gray-100 flex flex-col sticky top-0 h-screen z-50 transition-transform duration-300',
        isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        'fixed lg:relative',
      ]"
    >
      <div class="p-8">
        <div class="flex items-center gap-3 mb-12">
          <div
            class="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200"
          >
            <i class="pi pi-shield text-white text-xl"></i>
          </div>
          <div>
            <h1 class="text-xl font-black tracking-tighter italic">
              ADMIN<span class="text-indigo-600">.</span>CONTROL
            </h1>
            <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">
              Job Board Platform
            </p>
          </div>
        </div>

        <nav class="space-y-2">
          <router-link
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
            @click="isMobileOpen = false"
            class="flex items-center gap-4 px-6 py-4 rounded-2xl transition-all group"
            active-class="bg-indigo-50 text-indigo-600"
          >
            <i :class="[item.icon, 'text-lg']"></i>
            <span class="font-bold tracking-tight">{{ item.label }}</span>
            <div
              v-if="$route.path.includes(item.path)"
              class="ml-auto w-1.5 h-6 bg-indigo-600 rounded-full"
            ></div>
          </router-link>
        </nav>
      </div>

      <div class="mt-auto p-8 border-t border-gray-50">
        <div class="flex items-center gap-4 mb-6">
          <img
            :src="userAvatar"
            class="w-10 h-10 rounded-full object-cover border border-gray-100"
          />
          <div class="flex-1 min-w-0">
            <p class="text-sm font-bold text-slate-900 truncate">{{ (authStore.user?.first_name || '') + ' ' + (authStore.user?.last_name || '') }}</p>
            <p class="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">
              Super Admin
            </p>
          </div>
        </div>
        <button
          @click="handleLogout"
          class="w-full flex items-center justify-center gap-3 px-6 py-4 bg-red-50 text-red-600 rounded-2xl font-bold hover:bg-red-100 transition-colors"
        >
          <i class="pi pi-power-off"></i>
          <span>Logout</span>
        </button>
      </div>
    </aside>

    <main class="flex-1 flex flex-col min-w-0 relative">
      <!-- Global Loading Overlay (Optional but safer than v-if) -->
      <div
        v-if="adminStore.loading && !adminStore.categories.length"
        class="absolute inset-0 bg-white/50 backdrop-blur-sm z-[60] flex flex-col items-center justify-center"
      >
        <i class="pi pi-spin pi-spinner text-4xl text-indigo-600 mb-4"></i>
        <p class="text-gray-400 font-bold">Initializing Dashboard...</p>
      </div>

      <header
        class="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 lg:hidden sticky top-0 z-30"
      >
        <span class="font-black italic">ADMIN.CONTROL</span>
        <button @click="isMobileOpen = true" class="p-2 text-gray-400">
          <i class="pi pi-bars text-xl"></i>
        </button>
      </header>

      <div class="p-8 flex-1 overflow-y-auto">
        <router-view v-slot="{ Component }">
          <transition name="page" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/AuthStore'
import { useAdminStore } from '@/stores/AdminStore'
import { useRouter } from 'vue-router'


const authStore = useAuthStore()
const adminStore = useAdminStore()
const router = useRouter()
const isMobileOpen = ref(false)

const navItems = [
  { label: 'Dashboard', path: '/admin/dashboard', icon: 'pi pi-th-large' },
  { label: 'Taxonomy (US2)', path: '/admin/management/taxonomy', icon: 'pi pi-tags' },
  { label: 'Manage Jobs', path: '/admin/management/jobs', icon: 'pi pi-briefcase' },
  { label: 'Manage Users', path: '/admin/management/users', icon: 'pi pi-users' },
]

const userFullName = computed(() => {
  const first = authStore.user?.first_name || ''
  const last = authStore.user?.last_name || ''
  return `${first} ${last}`.trim()
})

const userAvatar = computed(
  () =>
    authStore.user?.avatar_url ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(userFullName.value)}&background=6366f1&color=fff`,
)

onMounted(() => adminStore.fetchAllData())

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}
</script>
