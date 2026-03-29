<script setup>
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '@/stores/auth.store'
import { useRouter } from 'vue-router'
import Button from 'primevue/button'
import Avatar from 'primevue/avatar'

const auth = useAuthStore()
const router = useRouter()
const mobileMenu = ref(false)
const isDark = ref(false)

const navSearch = ref('')

const handleSearch = () => {
  router.push({ name: 'jobs', query: { q: navSearch.value } })
}

const isLoggedIn = computed(() => !!auth.token)
const currentUser = computed(() => auth.user)

const toggleMenu = () => {
  mobileMenu.value = !mobileMenu.value
}

const handleLogout = () => {
  auth.logout()
  mobileMenu.value = false
  router.push({ name: 'home' })
}

const toggleTheme = () => {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark', isDark.value)
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}

onMounted(() => {
  isDark.value = localStorage.getItem('theme') === 'dark'
  document.documentElement.classList.toggle('dark', isDark.value)
})
</script>

<template>
  <nav class="fixed top-1 inset-x-0 z-50 px-4 font-['Outfit',sans-serif]">
    <div
      class="max-w-[1800px] mx-auto backdrop-blur-md bg-white/70 dark:bg-slate-950/70 border border-white/20 dark:border-slate-800/50 rounded-full px-6 py-2.5 flex items-center justify-between shadow-xl"
    >
      <router-link to="/" class="flex items-center gap-2 no-underline group">
        <div
          class="bg-indigo-600 rounded-xl p-2 group-hover:rotate-6 transition-transform shadow-lg shadow-indigo-500/20"
        >
          <i class="pi pi-briefcase text-white text-sm"></i>
        </div>
        <span class="text-xl font-black tracking-tighter text-slate-900 dark:text-white italic"
          >Hire<span class="text-indigo-600">Masr</span></span
        >
      </router-link>

      <div
        class="hidden md:flex items-center gap-1 bg-slate-100/50 dark:bg-slate-800/50 p-1 rounded-full"
      >
        <router-link
          v-for="link in [
            { n: 'Home', p: '/' },
            { n: 'Jobs', p: '/jobs' },
            { n: 'About', p: '/about' },
          ]"
          :key="link.n"
          :to="link.p"
          class="px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-indigo-600 transition-all no-underline"
          active-class="!text-white bg-indigo-600 shadow-lg shadow-indigo-600/20"
        >
          {{ link.n }}
        </router-link>
      </div>

      <div class="flex items-center gap-2">
        <Button
          @click="toggleTheme"
          :icon="isDark ? 'pi pi-sun' : 'pi pi-moon'"
          class="!w-9 !h-9 !rounded-full !border-none !text-slate-500"
          text
        />

        <div class="w-[1px] h-6 bg-slate-200 dark:bg-slate-800 mx-1 hidden sm:block"></div>

        <template v-if="isLoggedIn">
          <div class="flex items-center gap-3">
            <Avatar
              :image="`https://ui-avatars.com/api/?name=${currentUser?.name}&background=6366f1&color=fff`"
              shape="circle"
              class="cursor-pointer ring-2 ring-transparent hover:ring-indigo-500 transition-all !w-8 !h-8"
              @click="router.push(`/${currentUser?.role}/dashboard`)"
            />
            <Button
              @click="handleLogout"
              label="Logout"
              class="!bg-rose-50 dark:!bg-rose-500/10 !text-rose-600 !border-none !px-4 !py-2 !rounded-xl !text-[10px] !font-black !uppercase !tracking-widest hidden sm:block"
            />
          </div>
        </template>

        <template v-else>
          <div class="flex items-center gap-2">
            <router-link to="/auth/login"
              ><Button
                label="Login"
                class="!text-slate-600 dark:!text-slate-300 !border-none !text-[10px] !font-black !uppercase"
                text
            /></router-link>
            <router-link to="/auth/register"
              ><Button
                label="Join"
                class="!bg-indigo-600 !text-white !border-none !px-5 !py-2.5 !rounded-xl !text-[10px] !font-black !uppercase shadow-lg shadow-indigo-600/20"
            /></router-link>
          </div>
        </template>
      </div>
    </div>

    <div
      v-if="mobileMenu"
      class="md:hidden mt-3 mx-auto max-w-sm bg-white/95 dark:bg-slate-900/95 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] shadow-2xl p-4 flex flex-col gap-2"
    >
      <router-link
        v-for="link in [
          { n: 'Home', p: '/' },
          { n: 'Jobs', p: '/jobs' },
          { n: 'About', p: '/about' },
        ]"
        :key="link.n"
        :to="link.p"
        @click="toggleMenu"
        class="px-5 py-4 rounded-2xl text-slate-700 dark:text-slate-200 font-black text-[10px] uppercase tracking-widest no-underline"
      >
        {{ link.n }}
      </router-link>
      <button
        v-if="isLoggedIn"
        @click="handleLogout"
        class="w-full text-left px-5 py-4 text-rose-600 font-black text-[10px] uppercase tracking-widest"
      >
        Logout Session
      </button>
    </div>
  </nav>
</template>
