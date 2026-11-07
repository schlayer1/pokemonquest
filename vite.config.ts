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
      includeAssets: ['favicon.svg', 'icons/*.png'],
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
            src: '/icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/icons/maskable-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable'
          },
          {
            src: '/icons/maskable-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,json}'],
        maximumFileSizeToCacheInBytes: 15 * 1024 * 1024,
        skipWaiting: true,
        clientsClaim: true,
        cleanupOutdatedCaches: true,
        runtimeCaching: [
          {
            urlPattern: /\.(?:m4a|mp3|wav)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'voice-audio-cache',
              expiration: {
                maxEntries: 1000,
                maxAgeSeconds: 365 * 24 * 60 * 60 // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /\/assets\/.*\.(?:png|webp|svg|jpg)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'game-assets-cache',
              expiration: {
                maxEntries: 600,
                maxAgeSeconds: 365 * 24 * 60 * 60
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
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
