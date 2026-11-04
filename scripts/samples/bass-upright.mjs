// The upright bass (R29 SND): Karoryfer's Meatbass (a 1958 Otto Rubner double bass, pizzicato,
// CC0 1.0), first round robin, two of its four layers (vl2 soft, vl4 hard), roots every minor third
// from C1 to A3, 2.5 s each. Meatbass names its files by the pitch they sound (`a1` is MIDI 33).
// Run: node scripts/samples/bass-upright.mjs <Meatbass folder>
import { join } from 'node:path'
import { keyName, makeSet, sourceArgument } from './lib.mjs'

const source = sourceArgument('node scripts/samples/bass-upright.mjs <Meatbass>')

const FLATS = ['c', 'db', 'd', 'eb', 'e', 'f', 'gb', 'g', 'ab', 'a', 'bb', 'b']
const meatName = (midi) => `${FLATS[midi % 12]}${Math.floor(midi / 12) - 1}`

const ROOTS = [24, 27, 30, 33, 36, 39, 42, 45, 48, 51, 54, 57]
const LAYERS = [
  { name: 'p', upTo: 0.6, file: 'vl2' },
  { name: 'f', upTo: 1, file: 'vl4' },
]

makeSet('bass-upright', {
  instrument: 'bassUpright',
  set: 'Meatbass',
  licence: 'CC0-1.0',
  layers: LAYERS.map(({ name, upTo }) => ({ name, upTo })),
  bitrate: '96k',
  entries: LAYERS.flatMap((layer) =>
    ROOTS.map((midi) => ({
      file: `${layer.name}/${keyName(midi)}.m4a`,
      inputs: [
        {
          path: join(source, 'Samples', 'pizz', `${meatName(midi)}_${layer.file}_rr1.wav`),
          weight: 1,
        },
      ],
      seconds: 2.5,
      midi,
      layer: layer.name,
    })),
  ),
})
