import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  base: 'aldkli',
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    rollupOptions: {
      output: {
        dir: "aldkli",
        chunkFileNames: 'assets/js/aldklivue-[name]-[hash].js',
        entryFileNames: 'assets/js/aldklivue-[name]-[hash].js',
        assetFileNames: 'assets/[ext]/aldklivue-[name]-[hash].[ext]',
      }
    }
  },
})
