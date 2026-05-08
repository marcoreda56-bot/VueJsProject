<template>
  <div
    class="flex min-h-screen bg-[#FAFAFA] dark:bg-slate-950 font-['Outfit',sans-serif] transition-colors duration-300"
  >
    <!-- Sidebar -->
    <aside
      :class="[
        'fixed lg:sticky top-0 h-screen z-[80] transition-all duration-500 ease-in-out bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 flex flex-col shadow-2xl lg:shadow-none',
        isCollapsed ? 'w-24' : 'w-80',
        isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
      ]"
    >
      <!-- Collapse Toggle -->
      <button
        @click="isCollapsed = !isCollapsed"
        class="hidden lg:flex absolute -right-4 top-12 w-8 h-8 bg-indigo-600 text-white rounded-full items-center justify-center shadow-lg z-[90] hover:scale-110 transition-transform"
      >
        <i :class="['pi text-[10px]', isCollapsed ? 'pi-chevron-right' : 'pi-chevron-left']"></i>
      </button>

      <!-- Logo -->
      <div class="p-10 mb-6 flex justify-center lg:justify-start">
        <h2 v-if="!isCollapsed" class="text-2xl font-black text-slate-900 dark:text-white italic">
          Hire<span class="text-indigo-600">Masr.</span>
        </h2>
        <div
          v-else
          class="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-black italic text-xl"
        >
          H
        </div>
      </div>

      <!-- Nav -->
      <nav class="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar">
        <router-link
          v-for="link in navLinks"
          :key="link.path"
          :to="link.path"
          @click="isMobileOpen = false"
          class="flex items-center gap-4 px-5 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all group relative"
          active-class="bg-indigo-600 text-white shadow-xl shadow-indigo-600/30"
          :class="[
            isCollapsed ? 'justify-center' : '',
            'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50',
          ]"
        >
          <i :class="[link.icon, 'text-lg']"></i>
          <span v-if="!isCollapsed" class="whitespace-nowrap">{{ link.name }}</span>
        </router-link>
      </nav>

      <!-- User & Logout -->
      <div class="p-6 border-t border-slate-50 dark:border-slate-800">
        <button
          @click="handleLogout"
          class="flex items-center gap-4 py-4 rounded-2xl font-black text-[10px] uppercase text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all w-full px-5"
          :class="isCollapsed ? 'justify-center px-0' : ''"
        >
          <i class="pi pi-power-off text-lg"></i>
          <span v-if="!isCollapsed">Logout</span>
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 flex flex-col min-w-0 relative">
      <!-- Mobile Toggle -->
      <button
        @click="isMobileOpen = true"
        class="lg:hidden fixed bottom-8 right-8 z-[60] w-14 h-14 bg-indigo-600 shadow-2xl rounded-2xl text-white"
      >
        <i class="pi pi-bars text-xl"></i>
      </button>

      <header class="h-20 px-10 flex items-center justify-between lg:justify-end bg-transparent">
        <div class="lg:hidden font-black text-xl italic dark:text-white">
          Hire<span class="text-indigo-600">Masr.</span>
        </div>
        <div class="flex items-center gap-4">
          <span class="text-sm font-bold text-slate-400 hidden sm:block"
            >Welcome, {{ authStore.user?.name?.split(' ')[0] }}</span
          >
          <img
            :src="userAvatar"
            class="w-10 h-10 rounded-xl border-2 border-white dark:border-slate-800 shadow-sm"
          />
        </div>
      </header>

      <div class="flex-1 p-6 lg:p-10">
        <router-view v-slot="{ Component }">
          <transition name="page" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </main>

    <Transition name="fade">
      <div
        v-if="isMobileOpen"
        @click="isMobileOpen = false"
        class="lg:hidden fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[70]"
      ></div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/AuthStore'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()
const isCollapsed = ref(false)
const isMobileOpen = ref(false)

const navLinks = [
  { name: 'Dashboard', path: '/candidate/dashboard', icon: 'pi pi-th-large' },
  { name: 'Applications', path: '/candidate/applications', icon: 'pi pi-send' },
  { name: 'Profile', path: '/candidate/profile', icon: 'pi pi-user' },
  { name: 'Find Jobs', path: '/candidate/find-jobs', icon: 'pi pi-search' },
]

const userAvatar = computed(
  () =>
    authStore.user?.avatar ||
    `https://ui-avatars.com/api/?name=${authStore.user?.name}&background=6366f1&color=fff`,
)

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}
</script>
