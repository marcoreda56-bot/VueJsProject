<template>
  <div class="auth-container min-h-screen flex bg-white dark:bg-slate-950 transition-colors duration-500">
    <!-- Left Side: Form Area -->
    <div class="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-12 lg:p-20 relative overflow-hidden">
      <!-- Decorative background elements for the form side -->
      <div class="absolute top-0 left-0 w-64 h-64 bg-indigo-500/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
      <div class="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/5 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl"></div>
      
      <div class="w-full max-w-md relative z-10 transition-all duration-700 ease-out translate-y-0 opacity-100">
        <!-- Logo/Header -->
        <div class="flex items-center gap-3 mb-12 group cursor-pointer" @click="$router.push('/')">
          <div class="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200 group-hover:scale-110 transition-transform">
            <span class="text-white text-xl font-bold">J</span>
          </div>
          <span class="text-xl font-black text-slate-900 dark:text-white tracking-tight uppercase">JobNexus</span>
        </div>

        <slot name="form"></slot>
      </div>
    </div>

    <!-- Right Side: Illustration Area -->
    <div class="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-slate-900">
      <!-- Animated Background Pattern -->
      <div class="absolute inset-0 opacity-20">
        <svg class="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" stroke-width="0.1"/>
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#grid)" />
        </svg>
      </div>

      <!-- Glassmorphic Content Card -->
      <div class="relative z-10 flex flex-col items-center justify-center w-full px-20">
        <div class="space-y-8 text-center">
          <div class="inline-block p-4 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl animate-float">
            <slot name="illustration-icon">
              <!-- Default Icon/Image if none provided -->
              <svg class="w-24 h-24 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </slot>
          </div>
          
          <div class="space-y-4">
            <h2 class="text-4xl font-extrabold text-white leading-tight">
              <slot name="illustration-title">Connecting Talent with Opportunity</slot>
            </h2>
            <p class="text-slate-400 text-lg leading-relaxed max-w-md mx-auto">
              <slot name="illustration-description">
                Join thousands of professionals finding their dream careers through our intelligent platform.
              </slot>
            </p>
          </div>

          <!-- Feature Tags -->
          <div class="flex flex-wrap justify-center gap-3">
            <span class="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-xs font-semibold text-slate-300 backdrop-blur-md">Secure</span>
            <span class="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-xs font-semibold text-slate-300 backdrop-blur-md">Fast</span>
            <span class="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-xs font-semibold text-slate-300 backdrop-blur-md">Intelligent</span>
          </div>
        </div>
      </div>

      <!-- Gradient Overlays -->
      <div class="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/30 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
      <div class="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2"></div>
    </div>
  </div>
</template>
<script setup></script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap');

.auth-container {
  font-family: 'Outfit', sans-serif;
}

@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
}
.animate-float {
  animation: float 6s ease-in-out infinite;
}
</style>
