<template>
  <div class="space-y-8 font-['Outfit']">
    <header>
      <h2 class="text-3xl font-black italic">
        User <span class="text-indigo-600">Management.</span>
      </h2>
      <p class="text-gray-400 font-bold uppercase text-[10px] tracking-[0.2em]">
        Monitor and control platform members
      </p>
    </header>

    <div
      class="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 overflow-hidden shadow-xl shadow-indigo-500/5"
    >
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-slate-50/50 dark:bg-slate-800/50">
            <th class="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">
              User Info
            </th>
            <th class="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">
              Role
            </th>
            <th class="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">
              Status
            </th>
            <th
              class="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-50 dark:divide-slate-800">
          <tr
            v-for="user in adminStore.users"
            :key="user.id"
            class="hover:bg-slate-50/30 dark:hover:bg-slate-800/20 transition-colors"
          >
            <td class="p-6">
              <div class="flex items-center gap-4">
                <img
                  :src="`https://ui-avatars.com/api/?name=${user.name}&background=6366f1&color=fff`"
                  class="w-10 h-10 rounded-full"
                />
                <div>
                  <p class="font-bold text-slate-900 dark:text-white">{{ user.name }}</p>
                  <p class="text-xs text-slate-400">{{ user.email }}</p>
                </div>
              </div>
            </td>
            <td class="p-6">
              <span
                :class="
                  user.role === 'employer'
                    ? 'bg-purple-50 text-purple-600'
                    : 'bg-blue-50 text-blue-600'
                "
                class="px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest"
              >
                {{ user.role }}
              </span>
            </td>
            <td class="p-6">
              <div class="flex items-center gap-2">
                <span
                  :class="user.is_active ? 'bg-emerald-500' : 'bg-slate-300'"
                  class="w-2 h-2 rounded-full shadow-lg shadow-emerald-500/20"
                ></span>
                <span class="text-xs font-bold">{{ user.is_active ? 'Active' : 'Suspended' }}</span>
              </div>
            </td>
            <td class="p-6 text-right">
              <button
                @click="toggleStatus(user)"
                class="text-xs font-black uppercase tracking-widest text-indigo-600 hover:text-indigo-400 transition-colors"
              >
                {{ user.is_active ? 'Suspend' : 'Activate' }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { useAdminStore } from '@/stores/AdminStore'

const adminStore = useAdminStore()

const toggleStatus = async (user) => {
  const newStatus = !user.is_active
  await adminStore.updateUserStatus(user.id, newStatus)
}
</script>
