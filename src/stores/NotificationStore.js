import { defineStore } from 'pinia'
import { notificationsApi } from '@/api/services/api'

export const useNotificationStore = defineStore('notifications', {
  state: () => ({
    notifications: [],
    unreadCount: 0,
    loading: false,
  }),

  actions: {
    async fetchNotifications() {
      this.loading = true
      try {
        const response = await notificationsApi.getAll()
        this.notifications = response
      } catch (err) {
        console.error(err)
      } finally {
        this.loading = false
      }
    },

    async fetchUnreadCount() {
      try {
        const response = await notificationsApi.getUnreadCount()
        this.unreadCount = response.count
      } catch (err) {
        console.error(err)
      }
    },

    async markAsRead(id) {
      try {
        await notificationsApi.markRead(id)
        const notification = this.notifications.find((n) => n.id === id)
        if (notification) notification.read_at = new Date()
        if (this.unreadCount > 0) this.unreadCount--
      } catch (err) {
        console.error(err)
      }
    },
  },
})
