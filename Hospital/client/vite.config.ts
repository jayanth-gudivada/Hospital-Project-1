import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// During development the SPA runs on :8125 and the API on :3094.
// Proxy /api to the backend so the frontend can use same-origin relative URLs.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 8125,
    proxy: {
      '/api': 'http://localhost:3094',
    },
  },
})
