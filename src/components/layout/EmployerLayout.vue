<template>
  <div
    class="min-h-screen bg-[#FAFAFA] dark:bg-slate-950 flex font-['Plus_Jakarta_Sans',sans-serif]"
  >
    <aside
      class="w-72 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 p-8 hidden lg:flex flex-col sticky top-0 h-screen transition-all duration-300"
    >
      <div class="mb-10 px-2">
        <h2 class="text-2xl font-black text-slate-900 dark:text-white tracking-tighter italic">
          Hire<span class="text-indigo-600">Masr.</span>
        </h2>
      </div>

      <nav class="flex-1 space-y-2">
        <p
          class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-4 mt-6 border-t border-slate-100 dark:border-slate-800 pt-6"
        >
          Employer Menu
        </p>

        <router-link
          v-for="item in menuItems"
          :key="item.name"
          :to="item.path"
          class="flex items-center gap-4 px-5 py-3.5 rounded-2xl font-bold text-sm transition-all duration-200 no-underline group relative overflow-hidden"
          active-class="bg-indigo-600 text-white shadow-xl shadow-indigo-100 dark:shadow-none"
          :class="[
            isActive(item.path)
              ? ''
              : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-indigo-600',
          ]"
        >
          <i
            :class="[
              item.icon,
              isActive(item.path) ? 'text-white' : 'text-slate-400 group-hover:text-indigo-600',
            ]"
            class="text-lg transition-colors"
          ></i>
          <span class="relative z-10">{{ item.name }}</span>
          <span
            v-if="item.badge"
            class="ml-auto text-[10px] font-black px-2 py-0.5 rounded-full"
            :class="
              isActive(item.path) ? 'bg-white/20 text-white' : 'bg-indigo-100 text-indigo-600'
            "
            >{{ item.badge }}</span
          >
        </router-link>
      </nav>

      <div class="mt-auto pt-8 border-t border-slate-50 dark:border-slate-800 space-y-4">
        <button
          @click="handleLogout"
          class="w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl font-bold text-sm text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all font-black text-xs uppercase tracking-[0.2em]"
        >
          <i class="pi pi-power-off text-lg"></i>
          Logout
        </button>

        <div
          class="flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer group"
        >
          <img
            :src="`https://ui-avatars.com/api/?name=${encodeURIComponent(auth.user?.name || 'Employer')}&background=6366f1&color=fff`"
            class="w-10 h-10 rounded-xl shadow-sm border-2 border-transparent group-hover:border-indigo-500 transition-all"
          />
          <div class="flex-1 overflow-hidden">
            <p class="text-sm font-black text-slate-900 dark:text-white truncate">
              {{ auth.user?.name || 'Employer' }}
            </p>
            <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest truncate">
              Employer
            </p>
          </div>
        </div>
      </div>
    </aside>

    <main class="flex-1 flex flex-col min-w-0 overflow-hidden">
      <header
        class="h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 flex items-center justify-between px-10 sticky top-0 z-40"
      >
        <div class="lg:hidden font-black text-xl italic tracking-tighter">
          HIRE<span class="text-indigo-600">.</span>
        </div>
        <div class="hidden md:block text-sm font-bold text-slate-400">
          Hello,
          <span class="text-slate-900 dark:text-white font-black uppercase">{{
            auth.user?.name?.split(' ')[0] || 'Employer'
          }}</span>
          — Welcome back!
        </div>

        <div class="flex items-center gap-4">
          <button
            class="relative w-10 h-10 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center justify-center text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
          >
            <i class="pi pi-bell text-sm"></i>
          </button>
          <button
            class="lg:hidden w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-lg active:scale-95 transition-all"
          >
            <i class="pi pi-bars"></i>
          </button>
        </div>
      </header>

      <div class="p-10 flex-1 overflow-y-auto">
        <router-view />
      </div>
    </main>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const isActive = (path) => route.path === path

const menuItems = [
  { name: 'Dashboard', path: '/employer/dashboard', icon: 'pi pi-th-large' },
  { name: 'Post Job', path: '/employer/post-job', icon: 'pi pi-plus-circle' },
  { name: 'My Jobs', path: '/employer/manage-jobs', icon: 'pi pi-briefcase' },
  { name: 'Applications', path: '/employer/applications', icon: 'pi pi-inbox' },
]

const handleLogout = () => {
  auth.logout()
  router.push({ name: 'home' })
}
</script>
