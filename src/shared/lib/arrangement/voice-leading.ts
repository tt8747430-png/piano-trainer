import { midi, pitchClass, type Midi, type PitchClass, type Tone } from '@/shared/lib/music'

/** A right-hand voicing starts on one of the 13 notes from E3 up to E4, so it lies within 52–75. */
const LOWEST_BASE = 52
const HIGHEST_BASE = 64
const MIDDLE_C = 60

const ascending = (a: number, b: number) => a - b

/** These pitch classes stacked upward from `base`, lowest first. */
const voicingFrom = (base: number, pcs: readonly PitchClass[]): number[] =>
  pcs.map((pc) => base + pitchClass(pc - base)).sort(ascending)

/** How far the voices move from the previous voicing (voice by voice), or how far from middle C. */
function distance(voicing: readonly number[], before: readonly number[] | null): number {
  if (!before) return Math.abs((voicing[0] ?? MIDDLE_C) - MIDDLE_C)
  const lastVoice = before.length - 1
  let moved = 0
  voicing.forEach((m, i) => {
    moved += Math.abs(m - (before[Math.min(i, lastVoice)] ?? m))
  })
  return moved
}

/** The voicing of `pcs` that moves least from `previous`: the lowest such on a tie. */
export function voiceLead(previous: readonly Midi[] | null, pcs: readonly PitchClass[]): Midi[] {
  const before = previous?.length ? [...previous].sort(ascending) : null
  let nearest: number[] = []
  let shortest = Infinity
  for (let base = LOWEST_BASE; base <= HIGHEST_BASE; base++) {
    const voicing = voicingFrom(base, pcs)
    const moved = distance(voicing, before)
    if (moved < shortest) {
      shortest = moved
      nearest = voicing
    }
  }
  return nearest.map(midi)
}

/**
 * What the right hand plays of a chord: a triad whole; a seventh chord without its root (the bass
 * has it); a bigger chord without its root and 5th, at most four notes.
 */
export function rightHandPitchClasses(tones: readonly Tone[]): PitchClass[] {
  const upper = tones.length >= 4 ? tones.slice(1) : tones
  const fitted = upper.length > 4 ? upper.filter((tone) => tone.role !== '5th').slice(0, 4) : upper
  return fitted.map((tone) => tone.pitchClass)
}

/** The tones a chord adds above its 7th. */
const TENSIONS = new Set(['9th', '11th', '13th'])

/**
 * What the right hand plays of a chord in an inversion, in the order it stacks: a chord of up to four
 * notes whole (root, 3rd, 5th, 7th); a bigger one leaves its root to the bass and its 5th out, down to
 * four notes, its first tension standing where the root was.
 */
export function inversionPitchClasses(tones: readonly Tone[]): PitchClass[] {
  if (tones.length <= 4) return tones.map((tone) => tone.pitchClass)
  const upper = tones.slice(1)
  const fitted = upper.length > 4 ? upper.filter((tone) => tone.role !== '5th').slice(0, 4) : upper
  const first = fitted.find((tone) => TENSIONS.has(tone.role))
  const ordered = first ? [first, ...fitted.filter((tone) => tone !== first)] : fitted
  return ordered.map((tone) => tone.pitchClass)
}

/**
 * The chord stacked close from its note number `inversion` (a smaller chord from its last), the lowest
 * note from E3 to E4, the octave that moves least from `previous` when there are two.
 */
export function voiceInversion(
  previous: readonly Midi[] | null,
  pcs: readonly PitchClass[],
  inversion: number,
): Midi[] {
  const lowest = pcs[Math.min(inversion, pcs.length - 1)] ?? 0
  const before = previous?.length ? [...previous].sort(ascending) : null
  let nearest: number[] = []
  let shortest = Infinity
  for (let base = LOWEST_BASE; base <= HIGHEST_BASE; base++) {
    if (pitchClass(base) !== lowest) continue
    const voicing = voicingFrom(base, pcs)
    const moved = distance(voicing, before)
    if (moved < shortest) {
      shortest = moved
      nearest = voicing
    }
  }
  return nearest.map(midi)
}
