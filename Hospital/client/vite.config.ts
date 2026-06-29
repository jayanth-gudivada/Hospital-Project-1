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
  build: {
    rollupOptions: {
      output: {
        // Split big dependencies into their own chunks so no single file is huge
        // and browsers can cache vendor code separately from app code.
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('@mui/x-data-grid')) return 'mui-x';
            if (id.includes('@mui') || id.includes('@emotion')) return 'mui';
            if (id.includes('react')) return 'react';
            return 'vendor';
          }
        },
      },
    },
  },
})
