/// <reference types="vitest/config" />
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), tailwindcss(),],
  test: {
    environment: 'jsdom',
  },
})
