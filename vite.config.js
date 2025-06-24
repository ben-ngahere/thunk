import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  define: {
    '__API_BASE_URL__': JSON.stringify(process.env.VITE_API_BASE_URL),
  },
  server: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    },
    // Proxy should remain commented out
    // proxy: {
    //   '/api': 'http://localhost:3000',
    // },
  },
})