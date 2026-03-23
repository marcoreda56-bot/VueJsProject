<template>
  <div
    class="auth-layout min-h-screen w-full bg-[#F3F4F6]/50 flex items-center justify-center p-4 md:p-8 font-sans"
  >
    <div class="w-full max-w-[1200px] flex justify-center items-center">
      <router-view />
    </div>
  </div>
</template>

<style scoped>
/* خط احترافي (ممكن تضيفه في الـ index.html لو مش عندك) */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

.auth-layout {
  font-family: 'Inter', sans-serif;
  /* نقشة خفيفة جداً في الخلفية */
  background-image:
    linear-gradient(#e5e7eb 1px, transparent 1px),
    linear-gradient(90deg, #e5e7eb 1px, transparent 1px);
  background-size: 50px 50px;
}
</style>
