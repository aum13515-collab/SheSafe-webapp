import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}']
      },
      manifest: {
        name: 'SheSafe - Women Safety App',
        short_name: 'SheSafe',
        description: 'Emergency SOS alert system for women safety in India',
        theme_color: '#E91E8C',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        lang: 'en-IN',
        icons: [
          {
            src: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192"><rect fill="%23E91E8C" width="192" height="192"/><path fill="white" d="M96 20c-18.6 0-33.7 15.1-33.7 33.7 0 16.8 12.4 30.8 28.7 33.2v23.4c0 2.8 2.3 5.1 5.1 5.1h0.1c2.8 0 5.1-2.3 5.1-5.1v-22c2.9 0.3 5.9 0.5 9.1 0.5 3.2 0 6.2-0.2 9.1-0.5v22c0 2.8 2.3 5.1 5.1 5.1h0.1c2.8 0 5.1-2.3 5.1-5.1v-23.4c16.3-2.4 28.7-16.4 28.7-33.2 0-18.6-15.1-33.7-33.7-33.7zm0 57.4c-13.1 0-23.7-10.6-23.7-23.7S82.9 30 96 30c13.1 0 23.7 10.6 23.7 23.7s-10.6 23.7-23.7 23.7z"/></svg>',
            sizes: '192x192',
            type: 'image/svg+xml',
            purpose: 'any'
          }
        ]
      }
    })
  ],
  server: {
    port: 5173,
    strictPort: false
  },
  build: {
    outDir: 'dist',
    sourcemap: false
  }
})
