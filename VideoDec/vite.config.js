import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/media': {
        target: 'http://localhost:8000',  // Django backend URL
        changeOrigin: true,
      }
    },
  },
})
