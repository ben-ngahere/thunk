import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

console.log('VITE_API_BASE_URL during Vite build:', process.env.VITE_API_BASE_URL)

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    },
    // proxy: {
    //   '/api': 'http://localhost:3000',
    // },
  },
})
