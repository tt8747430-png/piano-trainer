// The drum kit (R29 SND): Virtuosity Drums (Versilian Studios and Karoryfer Samples, a jazz kit played
// with sticks, CC0 1.0). Each piece's stroke is its microphones mixed to mono as the set's own kits
// mix them (kick mic, snare mic, overheads, room), in two layers: `accent` its loudest velocity layer,
// `normal` the one at 55 % of its layers. The kit has two toms: the mid tom is the high tom tuned three
// semitones down. Run: node scripts/samples/drums.mjs <Virtuosity Drums folder>
import { existsSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { makeSet, sourceArgument } from './lib.mjs'

const source = sourceArgument('node scripts/samples/drums.mjs <Virtuosity Drums folder>')
const SAMPLES = join(source, 'Samples')

/** Each microphone and how much of it the stroke has. */
const MICS = [
  { mic: 'kickmic', weight: 1 },
  { mic: 'snaremic', weight: 0.8 },
  { mic: 'oh', weight: 0.8 },
  { mic: 'room', weight: 0.5 },
]

/** Each piece of the kit (`KitPiece`): its folder, its articulation, its length, its tuning. */
const PIECES = {
  kick: { folder: 'kick', articulation: 'kick_snoff', seconds: 1.2 },
  snare: { folder: 'snare', articulation: 'snare_center', seconds: 1.2 },
  rim: { folder: 'snare', articulation: 'snare_crossstick', seconds: 0.8 },
  hatClosed: { folder: 'hh', articulation: 'hh_closed', seconds: 0.6 },
  hatOpen: { folder: 'hh', articulation: 'hh_open', seconds: 2.5 },
  hatPedal: { folder: 'hh', articulation: 'hh_pedal', seconds: 0.8 },
  ride: { folder: 'ride', articulation: 'ride_ride', seconds: 3 },
  rideBell: { folder: 'ride', articulation: 'ride_bell', seconds: 3 },
  crash: { folder: 'crash', articulation: 'crash_crash', seconds: 3.5 },
  tomHigh: { folder: 'htom', articulation: 'htom_center', seconds: 1.5 },
  tomMid: { folder: 'htom', articulation: 'htom_center', seconds: 1.5, rate: 2 ** (-3 / 12) },
  tomFloor: { folder: 'ltom', articulation: 'ltom_center', seconds: 1.5 },
}

/** The velocity layers an articulation has, from its overhead files' names. */
function layersOf({ folder, articulation }) {
  const pattern = new RegExp(`^oh_${articulation}_vl(\\d+)(_rr1)?\\.flac$`)
  const layers = readdirSync(join(SAMPLES, 'oh', folder))
    .map((file) => pattern.exec(file)?.[1])
    .filter(Boolean)
    .map(Number)
  if (layers.length === 0) throw new Error(`no ${articulation} in ${folder}`)
  return Math.max(...layers)
}

/** A stroke's file on one microphone: the first round robin where it has them. */
function fileOf(mic, { folder, articulation }, layer) {
  const robin = join(SAMPLES, mic, folder, `${mic}_${articulation}_vl${layer}_rr1.flac`)
  return existsSync(robin)
    ? robin
    : join(SAMPLES, mic, folder, `${mic}_${articulation}_vl${layer}.flac`)
}

const LAYERS = [
  { name: 'normal', upTo: 0.8, at: (top) => Math.max(1, Math.round(top * 0.55)) },
  { name: 'accent', upTo: 1, at: (top) => top },
]

makeSet('drums', {
  instrument: 'drums',
  set: 'Virtuosity Drums',
  licence: 'CC0-1.0',
  layers: LAYERS.map(({ name, upTo }) => ({ name, upTo })),
  bitrate: '128k',
  entries: LAYERS.flatMap((layer) =>
    Object.entries(PIECES).map(([voice, piece]) => ({
      file: `${layer.name}/${voice}.m4a`,
      inputs: MICS.map(({ mic, weight }) => ({
        path: fileOf(mic, piece, layer.at(layersOf(piece))),
        weight,
      })),
      seconds: piece.seconds,
      rate: piece.rate ?? 1,
      voice,
      layer: layer.name,
    })),
  ),
})
