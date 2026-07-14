import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      // Polling required for network drives (UNC paths)
      usePolling: true,
      interval: 1000,
    },
  },
})
