<template>
  <div
    class="flex min-h-screen bg-[#FAFAFA] dark:bg-slate-950 font-['Plus_Jakarta_Sans',sans-serif]"
  >
    <aside
      class="w-80 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 hidden lg:flex flex-col sticky top-0 h-screen z-50"
    >
      <div class="p-10 mb-6">
        <h2 class="text-2xl font-black text-slate-900 dark:text-white tracking-tighter italic">
          Hire<span class="text-indigo-600">Masr.</span>
        </h2>
      </div>

      <nav class="flex-1 px-6 space-y-3">
        <router-link
          v-for="link in navLinks"
          :key="link.path"
          :to="link.path"
          class="flex items-center gap-4 px-6 py-4 rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] transition-all group no-underline"
          active-class="bg-indigo-600 text-white shadow-xl shadow-indigo-600/20"
          :class="
            $route.path !== link.path
              ? 'text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              : ''
          "
        >
          <i :class="link.icon" class="text-lg"></i>
          {{ link.name }}
        </router-link>
      </nav>

      <div class="p-8 border-t border-slate-50 dark:border-slate-800">
        <button
          @click="handleLogout"
          class="w-full flex items-center gap-4 px-6 py-4 rounded-[1.5rem] text-rose-500 font-black text-[10px] uppercase tracking-[0.2em] hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all"
        >
          <i class="pi pi-power-off"></i> Logout
        </button>
      </div>
    </aside>

    <main class="flex-1 overflow-y-auto relative">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth.store'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()

const navLinks = [
  { name: 'Dashboard', path: '/candidate/dashboard', icon: 'pi pi-th-large' },
  { name: 'My Applications', path: '/candidate/applications', icon: 'pi pi-send' },
  { name: 'Profile Settings', path: '/candidate/profile', icon: 'pi pi-user' },
  { name: 'Find Jobs', path: '/candidate/find-jobs', icon: 'pi pi-search' },
]

const handleLogout = () => {
  auth.logout()
  router.push({ name: 'home' })
}
</script>
