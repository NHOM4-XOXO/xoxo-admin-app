import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react()],
  server: {
    port: 3000,
    hmr: {
      overlay: false, // Disable error overlay that can cause reload
    },
    watch: {
      ignored: ['**/node_modules/**'], // Ignore db.json to prevent reload when JSON Server updates it
    },
  },
  build: {
    sourcemap: true,
  },
})
