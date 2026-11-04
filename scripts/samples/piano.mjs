// The sampled grand (A27, R29 SND): Salamander Grand Piano V3 (Alexander Holm, Yamaha C5, CC BY 3.0),
// 30 roots every minor third from A0 to C8 in four of its sixteen velocity layers (v4 p, v8 mp, v12 mf,
// v16 f), cut by register (A0–B2 10 s, C3–B4 6 s, C5–C8 3 s), each root's tuning from the set's
// retuned map (Markus Fiedler's) as cents in the manifest.
// Run: node scripts/samples/piano.mjs <SalamanderGrandPianoV3_44.1khz16bit folder>
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { keyName, makeSet, sourceArgument } from './lib.mjs'

const source = sourceArgument(
  'node scripts/samples/piano.mjs <SalamanderGrandPianoV3_44.1khz16bit>',
)

/** Salamander's name for a root: A0, C1, D#1, F#1 … */
const SALAMANDER = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
const salamanderName = (midi) => `${SALAMANDER[midi % 12]}${Math.floor(midi / 12) - 1}`

export const ROOTS = Array.from({ length: 30 }, (_, index) => 21 + index * 3)

/** Each root's tuning in cents, from the retuned map. */
export function tunings(folder) {
  const map = readFileSync(join(folder, 'SalamanderGrandPianoV3Retuned.sfz'), 'utf8')
  const tunes = new Map()
  for (const line of map.split('\n')) {
    const found = /sample=\S*?([A-G]#?\d)v\d+\.wav.*\btune=(-?\d+)/.exec(line)
    if (found) tunes.set(found[1], Number(found[2]))
  }
  return tunes
}

/** How long a root's file runs: the bass longest, as its strings ring longest. */
const secondsOf = (midi) => (midi < 48 ? 10 : midi < 72 ? 6 : 3)

const LAYERS = [
  { name: 'p', upTo: 0.35, velocity: 4 },
  { name: 'mp', upTo: 0.6, velocity: 8 },
  { name: 'mf', upTo: 0.85, velocity: 12 },
  { name: 'f', upTo: 1, velocity: 16 },
]

const tunes = tunings(source)
makeSet('piano', {
  instrument: 'piano',
  set: 'Salamander Grand Piano V3',
  licence: 'CC-BY-3.0',
  layers: LAYERS.map(({ name, upTo }) => ({ name, upTo })),
  bitrate: '96k',
  entries: LAYERS.flatMap((layer) =>
    ROOTS.map((midi) => ({
      file: `${layer.name}/${keyName(midi)}.m4a`,
      inputs: [
        {
          path: join(source, '44.1khz16bit', `${salamanderName(midi)}v${layer.velocity}.wav`),
          weight: 1,
        },
      ],
      seconds: secondsOf(midi),
      midi,
      layer: layer.name,
      tune: tunes.get(salamanderName(midi)) ?? 0,
    })),
  ),
})
