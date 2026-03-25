<script setup>
import { onMounted, ref, computed } from 'vue'
import { useAdminStore } from '@/stores/admin.store'

const adminStore = useAdminStore()
const searchQuerry = ref('')
const roleFilter = ref('all')

onMounted(async () => {
  await adminStore.fetchAllData()
})

const filteredUsers = computed(() => {
  return adminStore.users.filter(user => {
    const name = user.name || ''
    const email = user.email || ''
    const matchesSearch = name.toLowerCase().includes(searchQuerry.value.toLowerCase()) || 
                         email.toLowerCase().includes(searchQuerry.value.toLowerCase())
    const matchesRole = roleFilter.value === 'all' || user.role === roleFilter.value
    return matchesSearch && matchesRole
  })
})

const toggleUserStatus = async (user) => {
  try {
    await adminStore.updateUserStatus(user.id, !user.is_active)
  } catch (err) {
    alert('Failed to update user status')
  }
}

const getRoleBadgeClass = (role) => {
  switch (role) {
    case 'admin': return 'bg-purple-100 text-purple-700'
    case 'employer': return 'bg-blue-100 text-blue-700'
    case 'candidate': return 'bg-orange-100 text-orange-700'
    default: return 'bg-gray-100 text-gray-700'
  }
}
</script>

<template>
  <div class="p-10 max-w-7xl mx-auto">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
      <div>
        <div class="flex items-center gap-2 mb-2">
          <span class="w-2 h-2 bg-indigo-600 rounded-full"></span>
          <span class="text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em]">User Directory</span>
        </div>
        <h1 class="text-4xl font-black text-slate-900 tracking-tighter italic">
          Manage Users<span class="text-indigo-600">.</span>
        </h1>
      </div>

      <div class="flex flex-wrap gap-4">
        <div class="relative">
          <i class="pi pi-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
          <input 
            v-model="searchQuerry"
            type="text" 
            placeholder="Search users..." 
            class="pl-12 pr-6 py-3 bg-white border border-gray-100 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-bold text-sm w-64"
          />
        </div>
        <select 
          v-model="roleFilter"
          class="px-6 py-3 bg-white border border-gray-100 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-bold text-sm"
        >
          <option value="all">All Roles</option>
          <option value="admin">Admins</option>
          <option value="employer">Employers</option>
          <option value="candidate">Candidates</option>
        </select>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white border border-gray-100 rounded-[2.5rem] overflow-hidden shadow-sm">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-gray-50/50">
              <th class="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">User</th>
              <th class="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Role</th>
              <th class="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
              <th class="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-for="user in filteredUsers" :key="user.id" class="hover:bg-gray-50/50 transition-colors group">
              <td class="px-8 py-6">
                <div class="flex items-center gap-4">
                  <div class="w-10 h-10 bg-gray-100 rounded-full overflow-hidden flex-shrink-0">
                    <img :src="user.avatar || 'https://i.pravatar.cc/150?img=1'" alt="" class="w-full h-full object-cover" />
                  </div>
                  <div>
                    <router-link :to="`/admin/management/users/${user.id}`">
                      <p class="font-bold text-slate-900 leading-none mb-1 hover:text-indigo-600 transition-colors cursor-pointer">{{ user.name || 'Unnamed User' }}</p>
                    </router-link>
                    <p class="text-xs text-gray-400 font-medium">{{ user.email || 'No Email' }}</p>
                  </div>
                </div>
              </td>
              <td class="px-8 py-6">
                <span :class="[getRoleBadgeClass(user.role), 'text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full']">
                  {{ user.role }}
                </span>
              </td>
              <td class="px-8 py-6">
                <div class="flex items-center gap-2">
                  <span :class="['w-2 h-2 rounded-full', user.is_active ? 'bg-emerald-500' : 'bg-red-500']"></span>
                  <span class="text-xs font-bold text-slate-600">{{ user.is_active ? 'Active' : 'Inactive' }}</span>
                </div>
              </td>
              <td class="px-8 py-6 text-right">
                <button 
                  @click="toggleUserStatus(user)"
                  :class="[
                    'px-4 py-2 rounded-xl font-bold text-xs transition-all',
                    user.is_active ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                  ]"
                >
                  {{ user.is_active ? 'Deactivate' : 'Activate' }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="filteredUsers.length === 0" class="p-20 text-center">
        <div class="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
          <i class="pi pi-users text-3xl"></i>
        </div>
        <p class="text-gray-400 font-bold">No users found matching your criteria.</p>
      </div>
    </div>
  </div>
</template>
