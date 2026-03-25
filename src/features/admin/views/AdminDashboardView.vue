<script setup>
import { onMounted } from 'vue'
import { useAdminStore } from '@/stores/admin.store'

const adminStore = useAdminStore()

onMounted(async () => {
  await adminStore.fetchAllData()
})

const statCards = [
  { label: 'Total Users', key: 'totalUsers', icon: 'pi pi-users', color: 'bg-indigo-50 text-indigo-600' },
  { label: 'Total Jobs', key: 'totalJobs', icon: 'pi pi-briefcase', color: 'bg-emerald-50 text-emerald-600' },
  { label: 'Pending Approval', key: 'pendingJobs', icon: 'pi pi-clock', color: 'bg-amber-50 text-amber-600' },
  { label: 'Active Jobs', key: 'activeJobs', icon: 'pi pi-check-circle', color: 'bg-sky-50 text-sky-600' },
  { label: 'Applications', key: 'totalApplications', icon: 'pi pi-file-edit', color: 'bg-rose-50 text-rose-600' },
  { label: 'Employers', key: 'totalEmployers', icon: 'pi pi-building', color: 'bg-purple-50 text-purple-600' }
]
</script>

<template>
  <div class="p-10 max-w-7xl mx-auto">
    <!-- Header -->
    <div class="mb-12">
      <div class="flex items-center gap-2 mb-2">
        <span class="w-2 h-2 bg-indigo-600 rounded-full animate-pulse"></span>
        <span class="text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em]">System Overview</span>
      </div>
      <h1 class="text-4xl font-black text-slate-900 tracking-tighter italic">
        Dashboard<span class="text-indigo-600">.</span>
      </h1>
      <p class="text-gray-400 font-medium">Monitor platform activity and key performance indicators.</p>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
      <div
        v-for="stat in statCards"
        :key="stat.label"
        class="bg-white border border-gray-100 p-8 rounded-[2.5rem] shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all group"
      >
        <div class="flex items-start justify-between mb-6">
          <div :class="[stat.color, 'w-14 h-14 rounded-2xl flex items-center justify-center text-2xl transition-transform group-hover:scale-110 duration-500']">
            <i :class="stat.icon"></i>
          </div>
          <div class="flex items-center gap-1 text-[10px] font-black text-emerald-500 bg-emerald-50 px-3 py-1 rounded-full">
            <i class="pi pi-arrow-up text-[8px]"></i>
            <span>12%</span>
          </div>
        </div>
        
        <p class="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">
          {{ stat.label }}
        </p>
        <div class="flex items-end gap-2">
          <span class="text-4xl font-black text-slate-900 tracking-tighter tabular-nums">
            {{ adminStore.loading ? '...' : adminStore.stats[stat.key] }}
          </span>
        </div>
      </div>
    </div>

    <!-- Recent Activity Placeholder -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div class="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-sm">
        <h3 class="text-xl font-black text-slate-900 mb-6 tracking-tight">Recent Job Postings</h3>
        <div v-if="adminStore.loading" class="space-y-4">
          <div v-for="i in 3" :key="i" class="h-16 bg-gray-50 rounded-2xl animate-pulse"></div>
        </div>
        <div v-else class="space-y-4">
          <div v-for="job in adminStore.jobs.slice(0, 4)" :key="job.id" class="flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors">
            <div class="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
              <i class="pi pi-briefcase"></i>
            </div>
            <div class="flex-1 min-w-0">
              <p class="font-bold text-slate-900 truncate">{{ job.title }}</p>
              <p class="text-xs text-gray-400 font-medium">{{ job.location }} • {{ job.type }}</p>
            </div>
            <span :class="[
              'text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full',
              job.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
            ]">
              {{ job.status }}
            </span>
          </div>
        </div>
      </div>

      <!-- Recent User Signups -->
      <div class="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-sm">
        <h3 class="text-xl font-black text-slate-900 mb-6 tracking-tight">Recent User Signups</h3>
        <div v-if="adminStore.loading" class="space-y-4">
          <div v-for="i in 3" :key="i" class="h-16 bg-gray-50 rounded-2xl animate-pulse"></div>
        </div>
        <div v-else class="space-y-4">
          <div v-for="user in adminStore.users.slice(0, 4)" :key="user.id" class="flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors">
            <div class="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 font-black text-sm">
              {{ user.name?.charAt(0) || 'U' }}
            </div>
            <div class="flex-1 min-w-0">
              <p class="font-bold text-slate-900 truncate">{{ user.name || 'Unnamed User' }}</p>
              <p class="text-xs text-gray-400 font-medium">{{ user.email }}</p>
            </div>
            <span class="text-[10px] font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-wider">
              {{ user.role }}
            </span>
          </div>
          <div v-if="adminStore.users.length === 0" class="py-8 text-center text-gray-300 font-bold italic">
            No users registered yet.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
