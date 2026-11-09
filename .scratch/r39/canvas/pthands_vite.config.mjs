import { defineConfig } from 'vite'
const SRC = '/home/user/piano-trainer/src'
export default defineConfig({
  root: '/home/user/piano-trainer',
  resolve: { alias: [{ find: /^@\/shared\/ui$/, replacement: SRC + '/shared/ui/piano-keyboard/key-look.ts' }, { find: /^@\//, replacement: SRC + '/' }] },
  build: { outDir: process.env.OUT, emptyOutDir: true, assetsInlineLimit: 100000000, minify: true, target: 'es2020',
    lib: { entry: process.env.ENTRY, formats: ['iife'], name: 'PTHandsLib', fileName: () => 'pthands.js' } },
})
