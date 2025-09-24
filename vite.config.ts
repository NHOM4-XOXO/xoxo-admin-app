import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
// https://vitejs.dev/config/
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
    // Tắt sourcemap trong môi trường production để giảm kích thước build
    sourcemap: false,
    rollupOptions: {
      output: {
        /**
         * Đây là phần quan trọng nhất.
         * Nó sẽ chia các thư viện lớn (vendors) thành các tệp riêng biệt
         * thay vì gộp tất cả vào một file index.js khổng lồ.
         */
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // Tách các thư viện trong node_modules thành các chunk riêng
            // Ví dụ: react, react-dom sẽ có file riêng.
            return id.toString().split('node_modules/')[1].split('/')[0].toString();
          }
        }
      }
    }
  },
})
