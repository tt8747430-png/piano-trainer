import { midi, pitchClass, type Midi, type PitchClass, type Tone } from '@/shared/lib/music'

/** A right-hand voicing starts on one of the 13 notes from E3 up to E4, so it lies within 52–75. */
const LOWEST_BASE = 52
const BASES = Array.from({ length: 13 }, (_, i) => LOWEST_BASE + i)
const MIDDLE_C = 60

const ascending = (a: number, b: number) => a - b

/** These pitch classes stacked upward from `base`, lowest first. */
const voicingFrom = (base: number, pcs: readonly PitchClass[]): number[] =>
  pcs.map((pc) => base + pitchClass(pc - base)).sort(ascending)

/** How far the voices move from the previous voicing (voice by voice), or how far from middle C. */
function distance(voicing: readonly number[], previous: readonly number[] | null): number {
  if (!previous?.length) return Math.abs((voicing[0] ?? MIDDLE_C) - MIDDLE_C)
  const before = [...previous].sort(ascending)
  const lastVoice = before.length - 1
  return voicing.reduce((sum, m, i) => sum + Math.abs(m - (before[Math.min(i, lastVoice)] ?? m)), 0)
}

/** The voicing of `pcs` that moves least from `previous`: the first found on a tie. */
export function voiceLead(previous: readonly Midi[] | null, pcs: readonly PitchClass[]): Midi[] {
  const nearest = BASES.reduce<number[] | null>((best, base) => {
    const voicing = voicingFrom(base, pcs)
    return best && distance(best, previous) <= distance(voicing, previous) ? best : voicing
  }, null)
  return (nearest ?? []).map(midi)
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
