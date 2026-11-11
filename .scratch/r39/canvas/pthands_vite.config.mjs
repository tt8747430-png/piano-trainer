import { defineConfig } from 'vite'
const SRC = '/home/user/piano-trainer/src'
// The Chords canvas colours a pressed key by its chord tone (R42, settled with the owner), where the Player colours
// it by hand: the stage is built from the app's file with that one expression swapped.
const roleKeys = { name: 'role-keys', enforce: 'pre', transform(code, id) {
  if (!id.endsWith('ui/scene/stage.ts')) return null
  const from = 'paints.hand[by.side]'
  if (!code.includes(from)) throw new Error('stage.ts changed: role-keys patch does not apply')
  // and, for labels over the 3D keys: after each frame the canvas is told where a key's far end is on screen
  const draw = 'renderer.render(scene, camera)'
  if (!code.includes(draw)) throw new Error('stage.ts changed: label patch does not apply')
  return "import { keyX as __kx, KEY as __KEY } from '../../model/keys'\n" + code
    .replace(from, "(fill === 'white' || fill === 'black' ? paints.hand[by.side] : (paints.down.get(fill) ?? rest))")
    .replace(draw, draw + "; (canvas as unknown as { __ptAfter?: (p: (midi: number, black: boolean) => [number, number]) => void }).__ptAfter?.((midi, black) => { const v = new Vector3(__kx(midi), black ? __KEY.blackHeight : 0, -__KEY.length).project(camera); return [(v.x + 1) / 2, (1 - v.y) / 2] })")
} }

// The Piano sheet's Angle (R43 canvas 121): Seat is the app's camera; Above looks down more steeply. The camera's
// derived numbers are made re-computable so a board can set the angle before it builds a stage.
const angle = { name: 'angle', enforce: 'pre', transform(code, id) {
  if (!id.endsWith('model/camera.ts')) return null
  const need = ['  margin: KEY.width,\n} as const', 'const half = ', 'const below = ', 'const above = ', 'const NEAREST =', 'const BACK = ']
  for (const n of need) if (!code.includes(n)) throw new Error('camera.ts changed: angle patch does not apply: ' + n)
  const out = code.replace('  margin: KEY.width,\n} as const', '  margin: KEY.width,\n} as { pitch: number; [k: string]: any }')
    .replace('const half = ', 'let half = ').replace('const below = ', 'let below = ').replace('const above = ', 'let above = ')
    .replace('const NEAREST =', 'let NEAREST =').replace('const BACK = ', 'let BACK = ')
  return out + `
export function setPitch(deg: number): void {
  VIEW.pitch = (deg * Math.PI) / 180
  half = Math.tan(VIEW.fov / 2)
  below = 1 / Math.tan(VIEW.pitch + VIEW.fov / 2)
  above = 1 / Math.tan(VIEW.pitch - VIEW.fov / 2)
  NEAREST = (VIEW.top.z - VIEW.bottom.z + VIEW.bottom.y * below - VIEW.top.y * above) / (below - above)
  BACK = -VIEW.top.z * Math.cos(VIEW.pitch) - VIEW.top.y * Math.sin(VIEW.pitch)
}
`
} }
export default defineConfig({
  plugins: [roleKeys, angle],
  root: '/home/user/piano-trainer',
  resolve: { alias: [{ find: /^@\/shared\/ui$/, replacement: SRC + '/shared/ui/piano-keyboard/key-look.ts' }, { find: /^@\//, replacement: SRC + '/' }] },
  define: { 'import.meta.url': JSON.stringify('https://board.invalid/') },
  build: { outDir: process.env.OUT, emptyOutDir: true, assetsInlineLimit: 100000000, minify: true, target: 'es2020',
    lib: { entry: process.env.ENTRY, formats: ['iife'], name: 'PTHandsLib', fileName: () => 'pthands.js' } },
})
