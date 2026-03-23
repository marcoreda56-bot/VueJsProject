<template>
  <div
    class="group relative bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-[2rem] transition-all duration-300 hover:shadow-[0_20px_50px_rgba(0,0,0,0.04)] hover:-translate-y-1"
  >
    <div class="flex items-start justify-between mb-5">
      <div class="flex items-center gap-4">
        <div class="relative">
          <img
            :src="
              job.employer?.logo || 'https://ui-avatars.com/api/?name=' + job.employer?.company_name
            "
            class="w-14 h-14 rounded-2xl object-contain bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-2 shadow-sm"
            alt="company logo"
          />
          <div
            class="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full"
          ></div>
        </div>

        <div>
          <h3
            class="text-lg font-black text-slate-900 dark:text-white tracking-tight leading-none mb-1 group-hover:text-indigo-600 transition-colors"
          >
            {{ job.title }}
          </h3>
          <p class="text-indigo-600 dark:text-indigo-400 font-bold text-sm">
            {{ job.employer?.company_name }}
          </p>
        </div>
      </div>

      <span
        :class="getJobTypeClasses(job.type)"
        class="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border"
      >
        {{ job.type.replace('_', ' ') }}
      </span>
    </div>

    <div class="flex flex-wrap gap-y-2 gap-x-4 mb-6 text-sm">
      <div class="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-medium">
        <i class="pi pi-map-marker text-xs text-indigo-500"></i>
        {{ job.location }}
      </div>
      <div class="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-medium">
        <i class="pi pi-briefcase text-xs text-indigo-500"></i>
        {{ job.experience_level }}
      </div>
      <div
        v-if="job.is_salary_visible"
        class="flex items-center gap-1.5 text-slate-900 dark:text-slate-200 font-bold"
      >
        <i class="pi pi-wallet text-xs text-green-500"></i>
        {{ job.salary_min }} - {{ job.salary_max }} {{ job.currency }}
      </div>
    </div>

    <div
      class="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-slate-800"
    >
      <div class="flex flex-col">
        <span class="text-[10px] text-slate-400 uppercase font-black tracking-tighter leading-none"
          >Expires</span
        >
        <span class="text-xs text-slate-600 dark:text-slate-400 font-bold">
          {{
            new Date(job.expires_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
          }}
        </span>
      </div>

      <button
        @click="$router.push(`/jobs/${job.id}`)"
        class="px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold text-xs hover:bg-indigo-600 dark:hover:bg-indigo-500 dark:hover:text-white transition-all active:scale-95 flex items-center gap-2"
      >
        View Details
        <i class="pi pi-arrow-up-right text-[10px]"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps(['job'])

const getJobTypeClasses = (type) => {
  const base = 'border-opacity-20 '
  switch (type) {
    case 'full_time':
      return (
        base +
        'bg-green-50 text-green-600 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20'
      )
    case 'remote':
      return (
        base +
        'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20'
      )
    case 'internship':
      return (
        base +
        'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20'
      )
    default:
      return (
        base +
        'bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-500/10 dark:text-slate-400 dark:border-slate-500/20'
      )
  }
}
</script>
