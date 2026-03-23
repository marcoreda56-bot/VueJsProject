<script setup>
import { ref, onMounted } from 'vue'
import Button from 'primevue/button'
import Avatar from 'primevue/avatar'

const mobileMenu = ref(false)
const isDark = ref(false)

const toggleMenu = () => {
  mobileMenu.value = !mobileMenu.value
}

// دالة تحويل الثيم
const toggleTheme = () => {
  isDark.value = !isDark.value
  const theme = isDark.value ? 'dark' : 'light'
  document.documentElement.setAttribute('data-theme', theme)
  localStorage.setItem('theme', theme)
}

onMounted(() => {
  const savedTheme = localStorage.getItem('theme') || 'light'
  isDark.value = savedTheme === 'dark'
  document.documentElement.setAttribute('data-theme', savedTheme)
})
</script>

<template>
  <nav class="sticky top-0 z-5 px-4 py-3" aria-label="Main Navigation">
    <div
      class="max-w-7xl mx-auto glass-card border-round-pill px-6 py-2 flex align-items-center justify-content-between"
    >
      <router-link to="/" class="flex align-items-center gap-2 no-underline">
        <div
          class="bg-primary border-round-sm p-1 flex align-items-center justify-content-center shadow-2"
        >
          <i class="pi pi-briefcase text-white text-xl"></i>
        </div>
        <span class="text-xl font-800 tracking-tight logo-text">
          Hire<span class="text-primary">Masr</span>
        </span>
      </router-link>

      <div class="hidden md:flex align-items-center gap-5">
        <router-link to="/" class="nav-link" active-class="active-link">Home</router-link>
        <router-link to="/jobs" class="nav-link" active-class="active-link">Jobs</router-link>
        <router-link to="/categories" class="nav-link" active-class="active-link"
          >Categories</router-link
        >
      </div>

      <div class="flex align-items-center gap-2">
        <Button
          :icon="isDark ? 'pi pi-sun' : 'pi pi-moon'"
          text
          rounded
          severity="secondary"
          @click="toggleTheme"
        />

        <Button icon="pi pi-bell" text rounded severity="secondary" />

        <Avatar
          image="https://ui-avatars.com/api/?name=Marco+Reda&background=6366f1&color=fff"
          shape="circle"
          class="cursor-pointer ml-2 shadow-1"
          @click="$router.push('/profile/1')"
        />

        <Button icon="pi pi-bars" text class="md:hidden" @click="toggleMenu" />
      </div>
    </div>

    <div
      v-if="mobileMenu"
      class="md:hidden mt-3 glass-card border-round-xl p-4 flex flex-column gap-3 shadow-4 animate-fadein"
    >
      <router-link to="/" class="nav-link" @click="toggleMenu">Home</router-link>
      <router-link to="/jobs" class="nav-link" @click="toggleMenu">Jobs</router-link>
      <router-link to="/categories" class="nav-link" @click="toggleMenu">Categories</router-link>
    </div>
  </nav>
</template>

<style scoped>
.glass-card {
  backdrop-filter: blur(12px);
  background: var(--card-bg); /* استخدام متغير بدل اللون الثابت */
  border: 1px solid var(--border-color);
  transition: all 0.3s ease;
}

.logo-text {
  color: var(--text-main);
}

.nav-link {
  text-decoration: none;
  font-weight: 600;
  color: var(--text-main);
  opacity: 0.7;
  transition: 0.2s;
}

.nav-link:hover,
.active-link {
  opacity: 1;
  color: var(--primary) !important;
}
</style>
