<template>
  <div class="max-w-4xl mx-auto space-y-8 animate-fadeIn">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
        Notifications
      </h1>
      <button
        v-if="notifications.length > 0"
        @click="markAllRead"
        class="text-sm font-bold text-indigo-600 hover:text-indigo-700 transition"
      >
        Mark all as read
      </button>
    </div>

    <div v-if="loading" class="space-y-4">
      <div v-for="i in 3" :key="i" class="h-20 bg-gray-100 dark:bg-slate-800 animate-pulse rounded-xl"></div>
    </div>

    <div
      v-else-if="notifications.length === 0"
      class="bg-white dark:bg-slate-900 text-center py-20 rounded-[2.5rem] border border-slate-100 dark:border-slate-800"
    >
      <div class="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
        <i class="pi pi-bell text-slate-300 text-2xl"></i>
      </div>
      <p class="text-slate-500 dark:text-slate-400 font-bold">No notifications yet.</p>
    </div>

    <div v-else class="space-y-3">
      <div
        v-for="notif in notifications"
        :key="notif.id"
        class="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border dark:border-slate-800 flex items-start gap-4 cursor-pointer hover:shadow-md transition-all"
        :class="{ 'border-l-4 border-l-indigo-500': !notif.read_at }"
        @click="handleClick(notif)"
      >
        <div
          class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          :class="notif.read_at ? 'bg-slate-100 dark:bg-slate-800 text-slate-400' : 'bg-indigo-100 dark:bg-indigo-900/20 text-indigo-600'"
        >
          <i :class="notifIcon(notif)"></i>
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-start justify-between gap-4">
            <div>
              <h3 class="font-bold text-sm text-slate-900 dark:text-white">{{ notif.title }}</h3>
              <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">{{ notif.message }}</p>
            </div>
            <span class="text-xs text-slate-400 font-bold whitespace-nowrap">
              {{ formatDate(notif.created_at) }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { notificationsApi } from '@/api/services/api'

const router = useRouter()
const notifications = ref([])
const loading = ref(false)

const fetchNotifications = async () => {
  loading.value = true
  try {
    notifications.value = await notificationsApi.getAll()
  } catch (err) {
    console.error('Failed to load notifications', err)
  } finally {
    loading.value = false
  }
}

onMounted(fetchNotifications)

const handleClick = async (notif) => {
  if (!notif.read_at) {
    try {
      await notificationsApi.markRead(notif.id)
      notif.read_at = new Date().toISOString()
    } catch (err) {
      console.error('Failed to mark as read', err)
    }
  }
  if (notif.action_url) {
    router.push(notif.action_url)
  }
}

const markAllRead = async () => {
  try {
    await notificationsApi.markAllRead()
    notifications.value.forEach((n) => (n.read_at = new Date().toISOString()))
  } catch (err) {
    console.error('Failed to mark all as read', err)
  }
}

const notifIcon = (notif) => {
  const type = notif.data?.type || ''
  if (type.includes('interview')) return 'pi pi-calendar'
  if (type.includes('application')) return 'pi pi-send'
  if (type.includes('review')) return 'pi pi-star'
  if (type.includes('job')) return 'pi pi-briefcase'
  return 'pi pi-bell'
}

const formatDate = (date) =>
  date
    ? new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : ''
</script>
