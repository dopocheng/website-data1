import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  server: {
    port: 3100, // 设置端口号为 3000
    host: true,   // 设置为 true 以允许外部设备访问
    open: true,   // 可选，启动项目时自动打开浏览器
    proxy: {
      '/api': {
        target: 'http://192.168.1.29:8081', // 你的后端 API 地址
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
