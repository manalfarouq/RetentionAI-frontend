// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',  // Utiliser un chemin relatif simple 
    },
  },
  server: {
    port: 5173,
    open: true
  }
})