import type { Finger, Hand } from './fingering'
import { isBlackKey } from './keyboard'
import type { Midi } from './pitch'

/**
 * How far apart two fingers of the right hand reach, in semitones, from the lower finger's key to
 * the higher's (Parncutt, Sloboda, Clarke, Raekallio and Desain's table, 1997): the practical least,
 * the comfortable least, the relaxed least and most, the comfortable most, the practical most. A
 * negative reach is the higher finger crossing under or over the lower (the thumb under the 3rd).
 */
const REACH: Readonly<Record<string, readonly [number, number, number, number, number, number]>> = {
  '1-2': [-5, -3, 1, 5, 8, 10],
  '1-3': [-4, -2, 3, 7, 10, 12],
  '1-4': [-3, -1, 5, 9, 12, 14],
  '1-5': [-1, 1, 7, 10, 13, 15],
  '2-3': [1, 1, 1, 2, 3, 5],
  '2-4': [1, 1, 3, 4, 5, 7],
  '2-5': [2, 2, 5, 6, 8, 10],
  '3-4': [1, 1, 1, 2, 2, 4],
  '3-5': [1, 1, 3, 4, 5, 7],
  '4-5': [1, 1, 1, 2, 3, 5],
}

const FINGERS: readonly Finger[] = [1, 2, 3, 4, 5]

/** What it costs to play `to` with finger `b` after `from` with finger `a`, in the right hand. */
function step(from: Midi, a: Finger, to: Midi, b: Finger): number {
  const d = to - from
  if (d === 0) return a === b ? 0 : 2
  if (a === b) return 12
  const [low, high, reach] = a < b ? [a, b, d] : [b, a, -d]
  const [minPrac, minComf, minRel, maxRel, maxComf, maxPrac] = REACH[`${low}-${high}`] ?? [
    0, 0, 0, 0, 0, 0,
  ]
  // A crossing without the thumb (3 over 4) is not played.
  if (reach < 0 && low !== 1) return 40
  if (reach < minPrac || reach > maxPrac) return 40
  let cost = 0
  if (reach > maxComf) cost += 2 * (reach - maxComf)
  if (reach < minComf) cost += 2 * (minComf - reach)
  if (reach > maxRel) cost += reach - maxRel
  if (reach < minRel) cost += minRel - reach
  return cost
}

/** What a finger costs on its own key: the thumb, and less so the 5th, prefer a white key. */
const place = (key: Midi, finger: Finger) =>
  isBlackKey(key) ? (finger === 1 ? 3 : finger === 5 ? 1 : 0) : 0

/**
 * A melody's fingering, suggested (A30: "Suggest fingering" where the music prints none): the
 * fingers that play its keys at the least cost of stretch, crossing and a thumb on a black key,
 * found over the whole line at once (a Viterbi search, as Parncutt's model). The left hand is the
 * right one mirrored: its keys read downward.
 */
export function fingerPassage(keys: readonly Midi[], hand: Hand): Finger[] {
  if (keys.length === 0) return []
  // The left hand mirrored: its intervals turned over, so one table serves both hands.
  const seen = hand === 'rh' ? keys : keys.map((key) => -key as Midi)
  type Path = { cost: number; fingers: Finger[] }
  let paths: Path[] = FINGERS.map((finger) => ({
    cost: place(keys[0] ?? 0, finger) + (finger === 3 ? -0.5 : 0),
    fingers: [finger],
  }))
  for (let i = 1; i < seen.length; i += 1) {
    const from = seen[i - 1] ?? 0
    const to = seen[i] ?? 0
    const key = keys[i] ?? 0
    paths = FINGERS.map((b) => {
      const best = paths.reduce<Path | null>((chosen, path) => {
        const a = path.fingers.at(-1) ?? 1
        const cost = path.cost + step(from as Midi, a, to as Midi, b) + place(key, b)
        return chosen === null || cost < chosen.cost ? { cost, fingers: path.fingers } : chosen
      }, null)
      return { cost: best?.cost ?? Infinity, fingers: [...(best?.fingers ?? []), b] }
    })
  }
  const best = paths.reduce((chosen, path) => (path.cost < chosen.cost ? path : chosen))
  return best.fingers
}
