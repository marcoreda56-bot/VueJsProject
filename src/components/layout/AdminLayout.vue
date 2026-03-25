<template>
  <div class="min-h-screen bg-[#FBFBFB] flex font-['Plus_Jakarta_Sans',sans-serif]">
    <!-- Desktop Sidebar -->
    <aside class="w-72 bg-white border-r border-gray-100 flex flex-col hidden lg:flex sticky top-0 h-screen">
      <div class="p-8">
        <div class="flex items-center gap-3 mb-12">
          <div class="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
            <i class="pi pi-shield text-white text-xl"></i>
          </div>
          <div>
            <h1 class="text-xl font-black tracking-tighter italic">ADMIN<span class="text-indigo-600">.</span>CONTROL</h1>
            <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Job Board Platform</p>
          </div>
        </div>

        <nav class="space-y-2">
          <router-link
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
            class="flex items-center gap-4 px-6 py-4 rounded-2xl transition-all group"
            :class="[
              $route.path === item.path
                ? 'bg-indigo-50 text-indigo-600'
                : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'
            ]"
          >
            <i :class="[item.icon, 'text-lg', $route.path === item.path ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-600']"></i>
            <span class="font-bold tracking-tight">{{ item.label }}</span>
            <div v-if="$route.path === item.path" class="ml-auto w-1.5 h-6 bg-indigo-600 rounded-full"></div>
          </router-link>
        </nav>
      </div>

      <div class="mt-auto p-8 border-t border-gray-50">
        <div class="flex items-center gap-4 mb-6">
          <div class="w-10 h-10 bg-slate-100 rounded-full overflow-hidden">
            <img :src="user?.avatar || 'https://i.pravatar.cc/150?img=3'" alt="Avatar" class="w-full h-full object-cover" />
          </div>
          <div>
            <p class="text-sm font-bold text-slate-900 leading-none mb-1">{{ user?.name }}</p>
            <p class="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">Super Admin</p>
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

    <!-- Content -->
    <main class="flex-1 flex flex-col min-w-0 overflow-hidden">
      <!-- Header -->
      <header class="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-10 lg:hidden">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <i class="pi pi-shield text-white text-sm"></i>
          </div>
          <span class="font-black italic">ADMIN.CONTROL</span>
        </div>
        <button class="p-2 text-gray-400">
          <i class="pi pi-bars text-xl"></i>
        </button>
      </header>

      <div class="flex-1 overflow-y-auto overflow-x-hidden">
        <router-view v-slot="{ Component }">
          <transition
            enter-active-class="transition duration-300 ease-out"
            enter-from-class="opacity-0 translate-y-4"
            enter-to-class="opacity-100 translate-y-0"
          >
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'

const router = useRouter()
const authStore = useAuthStore()
const user = computed(() => authStore.user)

const navItems = [
  { label: 'Dashboard', path: '/admin/dashboard', icon: 'pi pi-th-large' },
  { label: 'Manage Jobs', path: '/admin/management/jobs', icon: 'pi pi-briefcase' },
  { label: 'Manage Users', path: '/admin/management/users', icon: 'pi pi-users' }
]

const handleLogout = () => {
  authStore.logout()
  router.push('/auth/login')
}
</script>
