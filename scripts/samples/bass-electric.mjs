// The electric bass (R29 SND): Karoryfer's Growlybass (a Squier Jazz Bass, fingered, CC0 1.0), its
// sustained notes, first round robin, two of its four layers (p soft, f hard), roots every minor third
// from E1 to A3, 2.5 s each. Growlybass names its files an octave above the pitch they sound (its
// `e2` sounds E1, MIDI 28, as a bass part is written an octave up); the manifest has the sounding key.
// Run: node scripts/samples/bass-electric.mjs <Growlybass folder>
import { join } from 'node:path'
import { keyName, makeSet, sourceArgument } from './lib.mjs'

const source = sourceArgument('node scripts/samples/bass-electric.mjs <Growlybass>')

/** Growlybass's lower-case name of a sounding key: E1 is `e2`, F♯1 `gb2`. */
const FLATS = ['c', 'db', 'd', 'eb', 'e', 'f', 'gb', 'g', 'ab', 'a', 'bb', 'b']
const growlyName = (midi) => `${FLATS[midi % 12]}${Math.floor(midi / 12)}`

const ROOTS = [28, 30, 33, 36, 39, 42, 45, 48, 51, 54, 57]
const LAYERS = [
  { name: 'p', upTo: 0.6, file: 'p' },
  { name: 'f', upTo: 1, file: 'f' },
]

makeSet('bass-electric', {
  instrument: 'bassElectric',
  set: 'Growlybass',
  licence: 'CC0-1.0',
  layers: LAYERS.map(({ name, upTo }) => ({ name, upTo })),
  bitrate: '96k',
  entries: LAYERS.flatMap((layer) =>
    ROOTS.map((midi) => ({
      file: `${layer.name}/${keyName(midi)}.m4a`,
      inputs: [
        { path: join(source, 'sustain', `${growlyName(midi)}_${layer.file}_rr1.wav`), weight: 1 },
      ],
      seconds: 2.5,
      midi,
      layer: layer.name,
    })),
  ),
})
