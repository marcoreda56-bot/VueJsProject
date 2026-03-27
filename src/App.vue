<template>
  <div class="app-container min-h-screen bg-gray-50">
    <AppNavbar v-if="!$route.meta.hideNavbar" />

    <main
      :class="[
        !$route.meta.hideNavbar
          ? 'w-full max-w-[1800px] mx-auto pt-12 pb-8 px-4 md:px-8'
          : 'w-full',
      ]"
    >
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <AppFooter v-if="!$route.meta.hideNavbar" />
  </div>
</template>

<script setup>
import AppNavbar from './components/AppNavbar.vue'
import AppFooter from './components/AppFooter.vue'
</script>
