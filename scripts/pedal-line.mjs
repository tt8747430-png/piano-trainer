// Moves the built-in pieces' sustain pedal from their notes' marks (`ped`, `pedup`, `pedch`) into
// each piece's pedal line (ADR 0097, round 29): `pedal: 'down@0 change@4 up@15.5'`. Each mark is read
// where the app reads its note, so its beat is the note's; the marks are taken off the notes.
// Run once: node scripts/pedal-line.mjs (it changes nothing where no piece has a pedal mark).
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createServer } from 'vite'

const root = fileURLToPath(new URL('..', import.meta.url))
const vite = await createServer({
  root,
  server: { middlewareMode: true, hmr: false },
  appType: 'custom',
  logLevel: 'error',
})
const load = (path) => vite.ssrLoadModule(path)
const { PIECES } = await load('/src/entities/piece/content/index.ts')
const { chartOf, stavesOf, barTicksOf } = await load('/src/entities/piece/model/chart.ts')
const { writePedalLine } = await load('/src/entities/piece/model/pedal-line.ts')

const KINDS = { ped: 'down', pedup: 'up', pedch: 'change' }
const MARKER = 'txt:PEDAL-'
/** A note's marks with the pedal's word turned into a marker the parser keeps (or taken off). */
const withMarks = (text, mark) =>
  text.replace(/\[([^\]]*)\]/g, (_, inside) => {
    const words = inside
      .split(',')
      .map((word) => (KINDS[word.trim()] ? mark(KINDS[word.trim()]) : word))
      .filter((word) => word !== '')
    return words.length > 0 ? `[${words.join(',')}]` : ''
  })
const marked = (text) => withMarks(text, (kind) => `${MARKER}${kind}`)
const cleaned = (text) => withMarks(text, () => '')
const hasPedal = (text) => text !== undefined && cleaned(text) !== text

const files = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name)
    if (statSync(path).isDirectory()) return files(path)
    return path.endsWith('.ts') && !path.endsWith('.test.ts') ? [path] : []
  })
const sources = files(join(root, 'src/entities/piece/content'))

let changed = 0
for (const piece of PIECES) {
  if ('progression' in piece) continue
  const texts = [
    ...(piece.staves ?? []).map((staff) => staff.notes),
    piece.hands?.rh,
    piece.hands?.lh,
  ]
  if (!texts.some(hasPedal)) continue
  const probe = {
    ...piece,
    staves: piece.staves?.map((staff) => ({ ...staff, notes: marked(staff.notes) })),
    hands: piece.hands && {
      ...(piece.hands.rh === undefined ? {} : { rh: marked(piece.hands.rh) }),
      ...(piece.hands.lh === undefined ? {} : { lh: marked(piece.hands.lh) }),
    },
  }
  const events = []
  const read = (n, offset = 0) => {
    const text = n.marks?.text
    if (text?.startsWith('PEDAL-'))
      events.push({ tick: n.startTick + offset, kind: text.slice('PEDAL-'.length) })
  }
  for (const staff of stavesOf(probe)) staff.notes.forEach((n) => read(n))
  const starts = barTicksOf({ ...piece, hands: undefined }).reduce(
    (all, ticks) => [...all, (all.at(-1) ?? 0) + ticks],
    [0],
  )
  chartOf(probe)
    .sections.flatMap((section) => section.lines.flat())
    .forEach((bar, index) => {
      for (const hand of ['rh', 'lh'])
        for (const n of bar.hands?.[hand] ?? []) read(n, starts[index] ?? 0)
    })
  const line = writePedalLine(events)

  const file = sources.find((path) => readFileSync(path, 'utf8').includes(`id: '${piece.id}'`))
  if (!file) throw new Error(`${piece.id}: no content file names it`)
  const whole = readFileSync(file, 'utf8')
  // The piece's own text: from its id to the next piece's, its notes' marks taken off there.
  const from = whole.indexOf(`id: '${piece.id}'`)
  const next = whole.indexOf("\n  id: '", from + 1)
  const to = next === -1 ? whole.length : next
  let source = whole.slice(0, from) + cleaned(whole.slice(from, to)) + whole.slice(to)
  const at = from
  const pattern = /\n(\s*)pattern: [^\n]*\n/g
  pattern.lastIndex = at
  const found = pattern.exec(source)
  if (!found) throw new Error(`${piece.id}: no pattern line to write the pedal after`)
  const end = found.index + found[0].length
  source = `${source.slice(0, end)}${found[1]}pedal: '${line}',\n${source.slice(end)}`
  writeFileSync(file, source)
  changed += 1
  console.log(`${piece.id}: pedal: '${line}'`)
}
console.log(changed === 0 ? 'No piece has a pedal mark.' : `${changed} pieces moved.`)
await vite.close()
