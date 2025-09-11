import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
export default defineConfig({
  plugins: [tailwindcss(), react()],
  server: {
    port: 3000,
    https: {
      key: './certificates/localhost+2-key.pem',
      cert: './certificates/localhost+2.pem'
    },
    hmr: {
      overlay: false,
    },
    watch: {
      ignored: ['**/node_modules/**'],
    },
  },
  build: {
    sourcemap: true,
  },
})





