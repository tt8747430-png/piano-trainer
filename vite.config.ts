import { fileURLToPath, URL } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import type { Plugin } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import { defineConfig } from 'vitest/config'
import { PRECACHE_ENGRAVER_LIMIT } from './src/shared/config/precache.ts'
import { THEME_COLORS } from './src/shared/config/theme-colors.ts'

const fromRoot = (path: string) => fileURLToPath(new URL(path, import.meta.url))

/**
 * The browser toolbar's colour for each OS scheme, ahead of index.html's #theme-boot script, which
 * repaints both for a chosen theme before first paint; ThemeProvider keeps them after.
 */
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
        injectTo: 'head-prepend',
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
      // The icons are in the precache by the glob below; listed here too, each would be there twice.
      includeManifestIcons: false,
      manifest: {
        id: '/',
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
        // The pieces' recordings too, so a recording plays offline.
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff2,m4a}'],
        // The engraver's worker is the largest file; the recordings are held to less by a test.
        maximumFileSizeToCacheInBytes: PRECACHE_ENGRAVER_LIMIT,
        // Only the fonts' subsets the app's text reaches: a browser fetches a subset when a glyph in
        // its range is drawn. None of these ranges holds a character the app writes (Onest's latin-ext
        // does, a credit's ž; its math and symbols hold ♭ ♯ and arrows); a glyph that ever needs one
        // fetches it from the network.
        globIgnores: [
          '**/literata-{greek,greek-ext,vietnamese,cyrillic-ext,latin-ext}-*.woff2',
          '**/onest-{vietnamese,cyrillic-ext}-*.woff2',
        ],
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
    globals: false,
    // A worker's files share their modules, so each does not import the app again (half the time).
    // The setup puts back what a test changes; a test must leave no state of its own behind.
    isolate: false,
    setupFiles: ['./src/shared/test/setup.ts'],
    // A file's first app test loads every screen's chunk first (renderApp): seconds on a busy runner.
    testTimeout: 15_000,
    css: false,
    // Two projects, so a test of logic never pays for a DOM: `unit` runs `*.test.ts` in node,
    // `dom` runs `*.test.tsx` in jsdom. A `*.test.ts` that needs a DOM says so on its first line
    // (`// @vitest-environment jsdom`). `npx vitest run --project unit` runs the fast half.
    projects: [
      {
        extends: true,
        test: { name: 'unit', environment: 'node', include: ['src/**/*.test.ts', '*.test.ts'] },
      },
      {
        extends: true,
        test: { name: 'dom', environment: 'jsdom', include: ['src/**/*.test.tsx'] },
      },
    ],
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
