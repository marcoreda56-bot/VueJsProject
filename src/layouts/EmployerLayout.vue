<template>
  <div class="min-h-screen bg-[#FAFAFA] dark:bg-slate-950 flex font-['Outfit',sans-serif]">
    <!-- Sidebar -->
    <aside
      :class="[
        'w-72 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 flex flex-col sticky top-0 h-screen transition-transform duration-300 z-50',
        isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        'fixed lg:relative',
      ]"
    >
      <div class="p-8">
        <h2
          class="text-2xl font-black text-slate-900 dark:text-white tracking-tighter italic mb-10"
        >
          Hire<span class="text-indigo-600">Masr.</span>
        </h2>

        <nav class="space-y-1">
          <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-4 mt-6">
            Main Menu
          </p>
          <router-link
            v-for="item in menuItems"
            :key="item.name"
            :to="item.path"
            @click="isMobileOpen = false"
            class="flex items-center gap-4 px-5 py-3.5 rounded-2xl font-bold text-sm transition-all group"
            active-class="bg-indigo-600 text-white shadow-xl shadow-indigo-100 dark:shadow-none"
          >
            <i :class="[item.icon, 'text-lg']"></i>
            <span>{{ item.name }}</span>
            <span
              v-if="item.badge"
              class="ml-auto bg-indigo-100 text-indigo-600 text-[10px] px-2 py-0.5 rounded-full group-[.router-link-active]:bg-white/20 group-[.router-link-active]:text-white"
            >
              {{ item.badge }}
            </span>
          </router-link>
        </nav>
      </div>

      <div class="mt-auto p-8 border-t border-slate-50 dark:border-slate-800 space-y-4">
        <button
          @click="handleLogout"
          class="w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all"
        >
          <i class="pi pi-power-off"></i> Logout
        </button>

        <div class="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
        <img :src="userAvatar" class="w-10 h-10 rounded-xl object-cover" />
        <div class="min-w-0">
          <p class="text-xs font-black text-slate-900 dark:text-white truncate">
            {{ (authStore.user?.first_name || '') + ' ' + (authStore.user?.last_name || '') }}
          </p>
            <p class="text-[9px] font-bold text-slate-400 uppercase">Employer Account</p>
          </div>
        </div>
      </div>
    </aside>

    <!-- Content -->
    <main class="flex-1 flex flex-col min-w-0">
      <header
        class="h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 flex items-center justify-between px-10 sticky top-0 z-40"
      >
        <div class="flex items-center gap-4">
          <button @click="isMobileOpen = true" class="lg:hidden w-10 h-10 bg-slate-100 rounded-lg">
            <i class="pi pi-bars"></i>
          </button>
          <div class="hidden md:block">
            <h1 class="text-sm font-bold text-slate-400">
              Welcome back,
              <span class="text-slate-900 dark:text-white font-black">{{
                authStore.user?.first_name
              }}</span>
            </h1>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <button
            class="w-10 h-10 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center justify-center text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 transition-all"
          >
            <i class="pi pi-bell"></i>
          </button>
        </div>
      </header>

      <div class="p-6 lg:p-10 flex-1 overflow-y-auto">
        <router-view v-slot="{ Component }">
          <transition name="page" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </main>

    <div
      v-if="isMobileOpen"
      @click="isMobileOpen = false"
      class="lg:hidden fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40"
    ></div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '@/stores/AuthStore'
import { useNotificationStore } from '@/stores/NotificationStore'
import { useRouter } from 'vue-router'


const authStore = useAuthStore()
const notificationStore = useNotificationStore()
const router = useRouter()
const isMobileOpen = ref(false)

const menuItems = computed(() => [
  { name: 'Dashboard', path: '/employer/dashboard', icon: 'pi pi-th-large' },
  { name: 'Company Profile', path: '/employer/profile', icon: 'pi pi-building' },
  { name: 'Post Job', path: '/employer/post-job', icon: 'pi pi-plus-circle' },
  { name: 'My Jobs', path: '/employer/manage-jobs', icon: 'pi pi-briefcase' },
  { name: 'Applications', path: '/employer/applications', icon: 'pi pi-inbox', badge: notificationStore.unreadCount || undefined },
  { name: 'Reviews', path: '/employer/reviews', icon: 'pi pi-star' },
  { name: 'Notifications', path: '/employer/notifications', icon: 'pi pi-bell' },
])

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

let pollInterval = null
onMounted(() => {
  notificationStore.fetchUnreadCount()
  pollInterval = setInterval(() => notificationStore.fetchUnreadCount(), 30000)
})

onUnmounted(() => {
  if (pollInterval) clearInterval(pollInterval)
})

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}
</script>
