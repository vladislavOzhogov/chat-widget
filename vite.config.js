import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  build: {
    lib: {
      entry: 'src/main.js',
      name: 'ChatWidget',
      fileName: 'chat-widget',
      formats: ['iife'],
    },
    outDir: 'dist',
    rollupOptions: {
      output: {
        assetFileNames: 'chat-widget.[ext]',
      },
    },
  },
})
