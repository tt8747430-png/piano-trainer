import { pitchClass, spellInKey, TICKS_PER_BEAT, type Key, type Midi } from '@/shared/lib/music'
import { STAVES, type StaffId, type TimedMusic } from '@/shared/lib/notation'

/** A chord of the trail: its keys, lowest first, and when its last key was struck (page clock, ms). */
export interface TrailChord {
  readonly keys: readonly Midi[]
  readonly last: number
}

/** What was played, chord by chord, oldest first (spec 2026-10-09 §5.1). */
export type Trail = readonly TrailChord[]

export const EMPTY_TRAIL: Trail = []

/** The chord held now and the four before it. */
export const TRAIL_CHORDS = 5

/** Keys struck within this of the chord's last key are the chord: a fast roll is one chord. */
export const CHORD_WINDOW_MS = 50

/** The trail after `key` is struck at `time`: into the newest chord, or a chord of its own. */
export function strike(trail: Trail, key: Midi, time: number): Trail {
  const newest = trail.at(-1)
  if (newest && time - newest.last <= CHORD_WINDOW_MS) {
    if (newest.keys.includes(key)) return trail
    const keys = [...newest.keys, key].sort((a, b) => a - b)
    return [...trail.slice(0, -1), { keys, last: time }]
  }
  return [...trail, { keys: [key], last: time }].slice(-TRAIL_CHORDS)
}

/** A bar's four beats: each chord is a whole note. */
const BAR_TICKS = 4 * TICKS_PER_BEAT
/** The treble's keys from middle C up. */
const MIDDLE_C = 60

const staffOf = (key: Midi): StaffId => (key >= MIDDLE_C ? 'treble' : 'bass')

/**
 * Chords as whole notes, a bar each in 4/4: the treble from middle C up, spelled in `key`, `names[i]`
 * over chord `i` where it has one; a staff with no key left blank, and no chords one blank bar.
 */
export function trailMusic(
  chords: readonly (readonly Midi[])[],
  key: Key,
  names: readonly string[],
): TimedMusic {
  const written = chords.length === 0 ? [[]] : chords
  return {
    key,
    meter: '4/4',
    bars: written.map((keys, i) => {
      const blank = STAVES.filter((staff) => !keys.some((each) => staffOf(each) === staff))
      return {
        startTick: i * BAR_TICKS,
        beats: 4,
        ...(blank.length > 0 ? { blank } : {}),
      }
    }),
    notes: chords.flatMap((keys, i) =>
      keys.map((each) => ({
        midi: each,
        spelled: spellInKey(pitchClass(each), key),
        hand: staffOf(each) === 'treble' ? 'rh' : 'lh',
        startTick: i * BAR_TICKS,
        durationTicks: BAR_TICKS,
      })),
    ),
    chords: names.flatMap((symbol, i) =>
      symbol === '' ? [] : [{ startTick: i * BAR_TICKS, symbol }],
    ),
  }
}
