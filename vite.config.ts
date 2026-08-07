import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 5173,
    // Active la superposition d'erreurs claire au lieu d'une page blanche
    hmr: {
      overlay: true,
    },
    // Force la réévaluation des fichiers modifiés
    watch: {
      usePolling: true,
    },
  },
  // Empêche la corruption du cache lors des changements fréquents
  optimizeDeps: {
    force: true,
  },
})