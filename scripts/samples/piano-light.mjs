// The light piano (R29 SND): the first notes before the grand's arrive, and offline before its
// download. One layer, about 30 roots, 3 s each, precached with the app.
// SND names Splendid Grand Piano (public domain) for it. Its source is a GitHub repository
// (sfzinstruments/SplendidGrandPiano) this session could not reach, so until it is made from Splendid
// it is made from Salamander's v10 (between mp and mf), the same CC BY 3.0 set as the grand.
// Run: node scripts/samples/piano-light.mjs salamander <SalamanderGrandPianoV3_44.1khz16bit folder>
//  or: node scripts/samples/piano-light.mjs splendid <SplendidGrandPiano folder> (then edit its SOURCES.md)
import { readdirSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { keyName, makeSet, sfzRegions } from './lib.mjs'

const [from, source] = process.argv.slice(2)
if (!source || !['salamander', 'splendid'].includes(from)) {
  console.error('usage: node scripts/samples/piano-light.mjs salamander|splendid <folder>')
  process.exit(1)
}

const ROOTS = Array.from({ length: 30 }, (_, index) => 21 + index * 3)
const SHARPS = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

/** Salamander's v10 file of each root. */
const fromSalamander = () =>
  ROOTS.map((midi) => ({
    midi,
    path: join(source, '44.1khz16bit', `${SHARPS[midi % 12]}${Math.floor(midi / 12) - 1}v10.wav`),
  }))

/** Splendid's map read: for each root, the region nearest it struck at velocity 80. */
function fromSplendid() {
  const map = readdirSync(source).find((file) => file.endsWith('.sfz'))
  if (!map) throw new Error(`no .sfz in ${source}`)
  const regions = sfzRegions(readFileSync(join(source, map), 'utf8'))
    .map((region) => ({
      midi: Number(region.pitch_keycenter ?? region.key),
      low: Number(region.lovel ?? 1),
      high: Number(region.hivel ?? 127),
      path: join(dirname(join(source, map)), region.sample),
    }))
    .filter((region) => Number.isFinite(region.midi) && region.low <= 80 && 80 <= region.high)
  const chosen = new Map()
  for (const root of ROOTS) {
    const nearest = regions.toSorted((a, b) => Math.abs(a.midi - root) - Math.abs(b.midi - root))[0]
    if (nearest) chosen.set(nearest.midi, nearest)
  }
  return [...chosen.values()]
}

const SET = {
  salamander: { set: 'Salamander Grand Piano V3', licence: 'CC-BY-3.0' },
  splendid: { set: 'Splendid Grand Piano', licence: 'public-domain' },
}[from]

makeSet('piano-light', {
  instrument: 'piano',
  ...SET,
  layers: [{ name: 'mf', upTo: 1 }],
  bitrate: '96k',
  entries: (from === 'salamander' ? fromSalamander() : fromSplendid()).map(({ midi, path }) => ({
    file: `${keyName(midi)}.m4a`,
    inputs: [{ path, weight: 1 }],
    seconds: 3,
    midi,
    layer: 'mf',
  })),
})
