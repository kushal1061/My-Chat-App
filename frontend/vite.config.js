import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: '0.0.0.0', // or use true
    port: 3000,
    allowedHosts: [
      'localhost',
      '.ngrok-free.app',   // allows all ngrok subdomains
    ]
  },

  plugins: [react()],
})
