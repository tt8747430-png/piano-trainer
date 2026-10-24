import type { Performance } from '@/shared/lib/arrangement'
import { midi } from '@/shared/lib/music'
import type { TimedMusic } from '@/shared/lib/notation'

/**
 * The music the Player's sheet writes: the tune on its own staff where it is heard (`ownStaff`; the
 * Player doubles it an octave up to stand out, its staff writes it as the song does), its words
 * left out where the View hides them (`lyrics` off, ADR 0093); else the performance itself.
 */
export function playedMusic(
  performance: Performance,
  ownStaff: boolean,
  lyrics = true,
): TimedMusic {
  if (!ownStaff && lyrics) return performance
  return {
    ...performance,
    notes: performance.notes.map((n) => {
      const { lyrics: _sung, ...silent } = n
      const written = lyrics ? n : silent
      return ownStaff && n.hand === 'melody' ? { ...written, midi: midi(n.midi - 12) } : written
    }),
    ...(ownStaff ? { melodyStaff: true } : {}),
  }
}
