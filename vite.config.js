import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

export default defineConfig({
  plugins: [vue(), vueDevTools()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 3001,
    proxy: {
      // Proxy API calls to the Laravel backend (port 8000)
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      // Proxy storage file requests to Laravel so it can serve files
      // from storage/app/private via the built-in storage/{path} route
      '/storage': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
})
