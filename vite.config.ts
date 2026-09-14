import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    target: 'es2022',
  },
  // Pre-bundle everything the lazily loaded routes import, so the first
  // visit to a route never triggers a dependency re-optimisation (which
  // forces a full page reload in dev).
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-dom/client',
      'react-router-dom',
      'framer-motion',
      'lucide-react',
      'react-hook-form',
      '@hookform/resolvers/zod',
      'zod',
    ],
  },
  server: {
    // Transform route modules ahead of time in dev; navigation stays instant.
    warmup: { clientFiles: ['./src/pages/*.tsx', './src/components/**/*.tsx'] },
  },
})
