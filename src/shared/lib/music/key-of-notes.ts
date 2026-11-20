import { signatureKey, type Key } from './key'
import { pitchClassOf } from './note'
import { pitchClass } from './pitch'

/** Krumhansl and Kessler's key profiles: how strongly each degree of a major and a minor key is heard. */
const MAJOR = [6.35, 2.23, 3.48, 2.33, 4.38, 4.09, 2.52, 5.19, 2.39, 3.66, 2.29, 2.88]
const MINOR = [6.33, 2.68, 3.52, 5.38, 2.6, 3.53, 2.54, 4.75, 3.98, 2.69, 3.34, 3.17]

/** Every key a signature writes, one a tonic and mode: D♭ to F♯ major, B♭ to D♯ minor. */
const KEYS: readonly Key[] = [false, true].flatMap((minor) =>
  Array.from({ length: 12 }, (_, at) => signatureKey(at - 5, minor)),
)

const correlation = (a: readonly number[], b: readonly number[]) => {
  const mean = (values: readonly number[]) => values.reduce((s, v) => s + v, 0) / values.length
  const [ma, mb] = [mean(a), mean(b)]
  let top = 0
  let da = 0
  let db = 0
  a.forEach((value, i) => {
    const x = value - ma
    const y = (b[i] ?? 0) - mb
    top += x * y
    da += x * x
    db += y * y
  })
  return da === 0 || db === 0 ? 0 : top / Math.sqrt(da * db)
}

/** The key notes are most likely in (Krumhansl–Schmuckler): their time on each pitch class against each key's profile. */
export function keyOfNotes(
  notes: readonly { readonly key: number; readonly length: number }[],
): Key {
  const weights = Array.from({ length: 12 }, () => 0)
  for (const n of notes) weights[pitchClass(n.key)] = (weights[pitchClass(n.key)] ?? 0) + n.length
  let best = KEYS[0] ?? signatureKey(0, false)
  let score = -Infinity
  for (const key of KEYS) {
    const profile = key.minor ? MINOR : MAJOR
    const tonic = pitchClassOf(key.tonic)
    const rotated = profile.map((_, pc) => profile[pitchClass(pc - tonic)] ?? 0)
    const fit = correlation(weights, rotated)
    if (fit > score) {
      score = fit
      best = key
    }
  }
  return best
}
