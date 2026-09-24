import { fileURLToPath, URL } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import type { Plugin } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import { defineConfig } from 'vitest/config'
import { THEME_COLORS } from './src/shared/config/theme-colors.ts'

const fromRoot = (path: string) => fileURLToPath(new URL(path, import.meta.url))

/** The browser toolbar's colour for each OS scheme; ThemeProvider repaints both for a chosen theme. */
function themeColorMeta(): Plugin {
  return {
    name: 'theme-color-meta',
    transformIndexHtml: () =>
      (['light', 'dark'] as const).map((scheme) => ({
        tag: 'meta',
        attrs: {
          name: 'theme-color',
          media: `(prefers-color-scheme: ${scheme})`,
          content: THEME_COLORS[scheme],
        },
        injectTo: 'head',
      })),
  }
}

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    themeColorMeta(),
    VitePWA({
      registerType: 'prompt',
      injectRegister: false,
      includeAssets: ['favicon.svg', 'favicon.ico', 'apple-touch-icon-180x180.png'],
      manifest: {
        name: 'Piano Trainer',
        short_name: 'Piano',
        description: 'Learn songs, chords and scales at the piano.',
        lang: 'en',
        display: 'standalone',
        start_url: '/',
        scope: '/',
        theme_color: THEME_COLORS.light,
        background_color: THEME_COLORS.light,
        icons: [
          { src: 'pwa-64x64.png', sizes: '64x64', type: 'image/png' },
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          {
            src: 'maskable-icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff2}'],
        navigateFallback: '/index.html',
        cleanupOutdatedCaches: true,
      },
      devOptions: { enabled: false },
    }),
  ],
  resolve: {
    alias: { '@': fromRoot('./src') },
  },
  test: {
    environment: 'jsdom',
    globals: false,
    setupFiles: ['./src/shared/test/setup.ts'],
    css: false,
    include: ['src/**/*.test.{ts,tsx}', '*.test.ts'],
    alias: {
      // vite-plugin-pwa's virtual module does not exist outside a Vite build.
      'virtual:pwa-register/react': fromRoot('./src/shared/test/pwa-register.ts'),
    },
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/*.test.{ts,tsx}',
        'src/**/*.d.ts',
        'src/**/testing/**',
        'src/shared/test/**',
        'src/main.tsx',
      ],
      thresholds: {
        'src/shared/lib/**': { lines: 90 },
        'src/entities/*/model/**': { lines: 90 },
      },
    },
  },
})
