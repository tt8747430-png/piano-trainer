import { pitchClass, spellInKey, TICKS_PER_BEAT, type Key, type Midi } from '@/shared/lib/music'
import { STAVES, type StaffId, type TimedMusic } from '@/shared/lib/notation'

/** A bar's four beats: each chord is a whole note. */
export const BAR_TICKS = 4 * TICKS_PER_BEAT
/** The treble's keys from middle C up. */
const MIDDLE_C = 60

const staffOf = (key: Midi): StaffId => (key >= MIDDLE_C ? 'treble' : 'bass')

/**
 * The chords logged as whole notes, a bar each in 4/4: the treble from middle C up, spelled in `key`, `names[i]`
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
