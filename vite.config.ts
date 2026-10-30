import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'assets/bosses/*.png', 'audio/voice/**/*.m4a'],
      manifest: {
        name: 'Levis Pokémon Quest Meister-Handbuch',
        short_name: 'QuestHandbuch',
        description: 'Das interaktive Meister-Handbuch für Pokémon Quest von Levi',
        theme_color: '#fbbf24',
        background_color: '#fef3c7',
        display: 'standalone',
        orientation: 'any',
        icons: [
          {
            src: '/favicon.svg',
            sizes: '192x192 512x512',
            type: 'image/svg+xml'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,json,m4a}'],
        maximumFileSizeToCacheInBytes: 35 * 1024 * 1024,
        skipWaiting: true,
        clientsClaim: true,
        cleanupOutdatedCaches: true,
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/raw\.githubusercontent\.com\/PokeAPI\/sprites\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'pokeapi-sprites-cache',
              expiration: {
                maxEntries: 200,
                maxAgeSeconds: 90 * 24 * 60 * 60 // 90 days
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      }
    })
  ]
});
