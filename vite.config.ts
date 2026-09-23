import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt', // mise à jour contrôlée par l'utilisateur (toast + bouton), pas de reload silencieux
      includeAssets: ['favicon.ico', 'apple-touch-icon.png'],
      workbox: {
        // important : inclure aussi les médias (audio, images)
        globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg,mp3,mp4}'],
        maximumFileSizeToCacheInBytes: 10 * 1024 * 1024, // 10 Mo — utile si la musique est lourde
        clientsClaim: true,
        skipWaiting: false, // laisser false en mode 'prompt' : c'est updateSW(true) qui déclenche l'activation
      },
      manifest: {
        name: 'Plateforme de l\'Institut Biblique Vie Nouvelle',
        short_name: 'Plateforme Vie Nouvelle',
        description: 'Fournit une plateforme pour l\'Institut Biblique Vie Nouvelle, permettant aux étudiants d\'accéder à des ressources théologiques.',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 5173,
    hmr: {
      overlay: true,
    },
    watch: {
      usePolling: true,
    },
  },
  optimizeDeps: {
    force: true,
  },
})