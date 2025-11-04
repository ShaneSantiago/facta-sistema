import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api': {
        target: 'https://cltoff-homol.facta.com.br',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '/clt')
      },
      '/gera-token': {
        target: 'https://cltoff-homol.facta.com.br',
        changeOrigin: true,
        secure: false
      }
    }
  }
})

