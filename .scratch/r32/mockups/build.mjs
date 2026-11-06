// Builds songs.html from songs2.html's head, helpers and feedback, and this round's body and screens.
import { copyFileSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const r30 = join(here, '../../r30/mockups')
const lines = readFileSync(join(r30, 'songs2.html'), 'utf8').split('\n')
const at = (pattern, from = 0) => lines.findIndex((line, i) => i >= from && line.startsWith(pattern))
const styleEnd = at('</style>')
const script = at('<script>')
const screens = at('const songsA')
const strips = at('// ——— strips')
const end = at('</script>', strips)
const head = lines
  .slice(0, styleEnd)
  .join('\n')
  .replace('<title>Songs, Round 31</title>', '<title>Songs, Round 32</title>')
const extraCss = `
/* R32: code in a line, the frames' titles */
code { font-size: 13px; background: var(--sand); border-radius: 6px; padding: 1px 5px }
`
const body = readFileSync(join(here, 'songs-src/body.html'), 'utf8')
const mine = readFileSync(join(here, 'songs-src/screens.js'), 'utf8')
const tail = lines
  .slice(strips, end + 1)
  .join('\n')
  .replaceAll('r31-songs-feedback', 'r32-songs-feedback')
const html = [
  head,
  extraCss,
  '</style>',
  '',
  body,
  lines.slice(script, screens).join('\n'),
  mine,
  tail,
].join('\n')
writeFileSync(join(here, 'songs.html'), html)
for (const frame of [
  'iphone-17-pro.png',
  'iphone-safari.png',
  'macbook-air.png',
  'macbook-wallpaper.jpg',
  'safari-light.png',
  'safari-dark.png',
])
  copyFileSync(join(r30, frame), join(here, frame))
console.log('songs.html', html.length)
