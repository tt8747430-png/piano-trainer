import { defineConfig } from 'vite'
const SRC = '/home/user/piano-trainer/src'
// The Chords canvas colours a pressed key by its chord tone (R42, settled with the owner), where the Player colours
// it by hand: the stage is built from the app's file with that one expression swapped.
const roleKeys = { name: 'role-keys', enforce: 'pre', transform(code, id) {
  if (!id.endsWith('ui/scene/stage.ts')) return null
  const from = 'paints.hand[by.side]'
  if (!code.includes(from)) throw new Error('stage.ts changed: role-keys patch does not apply')
  return code.replace(from, "(fill === 'white' || fill === 'black' ? paints.hand[by.side] : (paints.down.get(fill) ?? rest))")
} }
export default defineConfig({
  plugins: [roleKeys],
  root: '/home/user/piano-trainer',
  resolve: { alias: [{ find: /^@\/shared\/ui$/, replacement: SRC + '/shared/ui/piano-keyboard/key-look.ts' }, { find: /^@\//, replacement: SRC + '/' }] },
  build: { outDir: process.env.OUT, emptyOutDir: true, assetsInlineLimit: 100000000, minify: true, target: 'es2020',
    lib: { entry: process.env.ENTRY, formats: ['iife'], name: 'PTHandsLib', fileName: () => 'pthands.js' } },
})
