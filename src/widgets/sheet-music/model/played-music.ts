import type { Performance } from '@/shared/lib/arrangement'
import { midi } from '@/shared/lib/music'
import { EXTRA_VOICES, type TimedMusic, type TimedNote } from '@/shared/lib/notation'

/**
 * The music the Player's sheet writes: where a piece has more voices (ADR 0066) or plays its tune on an
 * instrument (ADR 0070), every part on a
 * staff of its own, the tune's first, over the piano's (the tune doubled an octave up is the same tune,
 * not written twice); else the tune on its own staff where it is heard (`ownStaff`; the Player doubles
 * it an octave up to stand out, its staff writes it as the song does); else the performance itself.
 */
export function playedMusic(performance: Performance, ownStaff: boolean): TimedMusic {
  const [tune = [], ...more] = performance.sung ?? []
  if (more.length > 0 || performance.instruments?.length) {
    const voiceStaves = EXTRA_VOICES.slice(0, more.length)
    // Each sung staff's instrument (ADR 0070): the tune's first, then each voice's.
    const staffInstruments = Object.fromEntries(
      (['melody', ...voiceStaves] as const).flatMap((staff, i) => {
        const instrument = performance.instruments?.[i]
        return instrument ? [[staff, instrument]] : []
      }),
    )
    return {
      ...(Object.keys(staffInstruments).length > 0 ? { staffInstruments } : {}),
      ...performance,
      notes: [
        ...performance.notes.filter((n) => n.hand !== 'melody'),
        ...tune.map((n): TimedNote => ({ ...n, hand: 'melody' })),
        ...voiceStaves.flatMap((voice, i) =>
          (more[i] ?? []).map((n): TimedNote => ({ ...n, hand: 'melody', voice })),
        ),
      ],
      melodyStaff: true,
      voiceStaves,
    }
  }
  if (!ownStaff) return performance
  return {
    ...performance,
    notes: performance.notes.map((n) =>
      n.hand === 'melody' ? { ...n, midi: midi(n.midi - 12) } : n,
    ),
    melodyStaff: true,
  }
}
