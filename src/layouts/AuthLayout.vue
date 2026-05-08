<template>
  <div class="min-h-screen transition-colors duration-500">
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
<script setup></script>

<style>
@keyframes fadeIn {
  to {
    opacity: 1;
  }
}
@keyframes slideUp {
  to {
    transform: translateY(0);
  }
}
</style>
